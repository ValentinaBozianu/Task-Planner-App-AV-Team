document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();


   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   const role = document.getElementById('role').value;

  
   let manager_name = '';

   
   if (role === 'executant') {
       manager_name = document.getElementById('managerSelect').value;
   }


   const userData = {
       name,
       email,
       password,
       role,
       manager_name 
   };

 
   registerUser(userData);
});
function addTaskToTable(description, manager, assignee, status) {
    const table = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);
    
    const descCell = newRow.insertCell(0);
    const managerCell = newRow.insertCell(1); 
    const assigneeCell = newRow.insertCell(2);
    const statusCell = newRow.insertCell(3);
    const actionCell = newRow.insertCell(4);

    descCell.textContent = description;
    managerCell.textContent=manager;
    assigneeCell.textContent = assignee;
    statusCell.className='status';
    statusCell.textContent = status;

    newRow.setAttribute('data-task-description', description);

    const changeStatusButton = document.createElement('button');
    changeStatusButton.textContent = 'Schimbă Starea';
    changeStatusButton.className = 'changeStatusButton';
    changeStatusButton.onclick = function() { changeTaskStatus(newRow, status); };
    actionCell.appendChild(changeStatusButton);
}

document.getElementById('createTaskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.getElementById('taskDescription').value;
    const managerName = document.getElementById('taskManager').value; 
    const assigneeEmail = document.getElementById('taskAssignee').value; 
    const token = localStorage.getItem('token'); 

    createTask({
        description: description,
        assigneeEmail: assigneeEmail, 
        managerName:managerName
    }, token);
});

function createTask(taskData, token) {
    fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token} `
        },
        body: JSON.stringify(taskData)
        
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la crearea task-ului');
        }
        return response.json();
    })
    .then(newTask => {
        if(newTask.description && newTask.managerName && newTask.assigneeEmail && newTask.status) {
            console.log('Task creat:', newTask);
            addTaskToTable(newTask.description, newTask.managerName, newTask.assigneeEmail, newTask.status);
        } else {
            console.error('Răspunsul nu conține toate datele necesare pentru un task.');
        }
    })
    .catch(error => {
        console.error('Eroare:', error);
        alert('Eroare la crearea task-ului ');
    });
}

document.getElementById('role').addEventListener('change', function(event) {
    if (event.target.value === 'executant') {
       
        document.getElementById('managerSelectGroup').style.display = 'block';
        fetchManagers();
    } else {
  
        document.getElementById('managerSelectGroup').style.display = 'none';
    }
});

function fetchManagers() {
    fetch('http://localhost:3000/api/users') 
    .then(response => response.json())
    .then(managers => {
        const managerSelect = document.getElementById('managerSelect');
        
        managerSelect.innerHTML = '';
        managers.forEach(manager => {
            const option = document.createElement('option');
            option.value = manager.name; 
            option.textContent = manager.name; 
            managerSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Eroare la încărcarea managerilor:', error);
    });
}



function registerUser(userData) {
    fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la înregistrare: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.message) {
            alert('Utilizator înregistrat cu succes!');
           
        }
    })
    .catch(error => {
        console.error('Eroare la înregistrare:', error);
        alert(error.message);
    });
}
document.addEventListener('DOMContentLoaded', function() {

    
    const showRegisterFormBtn = document.getElementById('showRegisterForm');
    const showLoginFormBtn = document.getElementById('showLoginForm');
    const showTaskSectionBtn = document.getElementById('showTaskSection');
    const registerInterface = document.getElementById('registerInterface');
    const loginInterface = document.getElementById('loginInterface');
    const managerInterface = document.getElementById('managerInterface');

    function hideAllSections() {
        registerInterface.style.display = 'none';
        loginInterface.style.display = 'none';
        managerInterface.style.display = 'none';
    }

    function showSection(section) {
        hideAllSections();
        section.style.display = 'block';
    }

    showRegisterFormBtn.addEventListener('click', function() {
        showSection(registerInterface);
    });

    showLoginFormBtn.addEventListener('click', function() {
        showSection(loginInterface);
    });

    showTaskSectionBtn.addEventListener('click', function() {
        showSection(managerInterface);
    });
   


    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        loginUser(email, password);
    });

    function loginUser(email, password) {
        fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare de autentificare');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
               
                alert(`Bine ai venit!`);
                console.log('Token:', data.token);  
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', data.role); 
                showSection(managerInterface);
                localStorage.setItem('userEmail', email);
                loadTasks();
            } else {
               
                alert(data.message || 'Eroare necunoscută');
                console.error('Răspuns eroare:', data); 
            }
        })
        .catch(error => {
           
            console.error('Eroare:', error);
            alert(error.message || 'A apărut o eroare la conectare.');
        });
    }
    
  
    const taskTableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

    createTaskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const description = document.getElementById('taskDescription').value;
        const assignee = document.getElementById('taskAssignee').value;
        const manager = document.getElementById('taskManager').value;

        const newRow = taskTableBody.insertRow(taskTableBody.rows.length);

        addTaskToTable(description, manager, assignee, 'Open');

        createTaskForm.reset();
    });

  


    window.changeTaskStatus = function(button) {
        const row = button.closest('tr');
        const taskDescription = row.getAttribute('data-task-description');
        const statusCell = row.getElementsByClassName('status')[0];
        const currentStatus = statusCell.innerText;
        let newStatus;

        switch (currentStatus) {
            case 'Open':
                newStatus = 'Pending';
                break;
            case 'Pending':
                newStatus = 'Completed';
                break;
            case 'Completed':
                newStatus = 'Closed';
               
                button.disabled = true;
                break;
            default:
                newStatus = 'Open';
                break;
        }

        if (newStatus === 'Closed') {
           
            button.disabled = true;
        }
        

        fetch(`http://localhost:3000/api/tasks/description/${encodeURIComponent(taskDescription)}/status`, { 
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
    })
        console.log(`Task-ul a fost schimbat la: ${newStatus}`);
        statusCell.innerText = newStatus;
    }

    function loadTasks() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    

    let url = 'http://localhost:3000/api/tasks';
    let headers = {
        'Authorization': `Bearer ${token}`
    };

    
    if (userRole === 'executant') {
        url += `?assigned_to=${userEmail}`;
    } else if (userRole === 'manager') {
        url += `?created_by=${userEmail}`;
    }

   
    fetch(url, { headers })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la incarcarea task-urilor');
        }
        return response.json();
    })
    .then(tasks => {
        
        const taskTableBody = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
        taskTableBody.innerHTML = '';
    
      
        tasks.forEach(task => {
            addTaskToTable(task.description, task.managerName, task.assigneeEmail, task.status);
        });
    })
    .catch(error => {
        console.error('Eroare la încărcarea task-urilor:', error);
        alert(error.message);
    });
}

    
});