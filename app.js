const STORAGE_KEY = 'todos-v2';

let todos =
JSON.parse(
localStorage.getItem(STORAGE_KEY)
|| '[]'
);

let filter='all';

const save=()=>{

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(todos)
);

};

const uid=()=>{

return Date.now().toString(36)+
Math.random().toString(36).slice(2,8);

};

const form=document.getElementById('todo-form');

const input=document.getElementById('todo-input');

const category=document.getElementById('todo-category');

const list=document.getElementById('todo-list');

const countEl=document.getElementById('todo-count');

const filters=document.querySelectorAll('.filters button');

const clearBtn=document.getElementById('clear-completed');

const darkBtn=document.getElementById('dark-mode-btn');



function render(){

const visible=todos.filter(t=>{

if(filter==='all') return true;

if(filter==='active') return !t.completed;

return t.completed;

});

list.innerHTML='';

if(visible.length===0){

list.innerHTML='<li>No tasks</li>';

}

else{

visible.forEach(t=>{

const li=document.createElement('li');

li.className='todo-item'+

(t.completed?' completed':'');

li.dataset.id=t.id;

li.innerHTML=`

<input type="checkbox"

${t.completed?'checked':''}>

<div class="text">

${t.text}

<span class="tag">

${t.category}

</span>

</div>

<button class="edit">

✏️

</button>

<button class="delete">

❌

</button>

`;

list.appendChild(li);

});

}

const remaining=todos.filter(

t=>!t.completed

).length;

countEl.textContent=

`${remaining} items left`;

filters.forEach(btn=>{

btn.classList.toggle(

'active',

btn.dataset.filter===filter

);

});

}



function addTask(text){

const trimmed=text.trim();

if(!trimmed) return;

todos.unshift({

id:uid(),

text:trimmed,

category:category.value,

completed:false

});

save();

render();

}



function toggleTask(id){

todos=todos.map(t=>

t.id===id

?

{

...t,

completed:!t.completed

}

:

t

);

save();

render();

}



function deleteTask(id){

todos=todos.filter(

t=>t.id!==id

);

save();

render();

}



function editTask(id){

const task=todos.find(

t=>t.id===id

);

if(!task) return;

const newText=prompt(

'Edit task',

task.text

);

if(newText===null) return;

task.text=newText.trim();

save();

render();

}



form.addEventListener(

'submit',

e=>{

e.preventDefault();

addTask(input.value);

input.value='';

}

);



list.addEventListener(

'click',

e=>{

const li=e.target.closest('li');

if(!li) return;

const id=li.dataset.id;



if(e.target.type==='checkbox')

toggleTask(id);



if(e.target.classList.contains('delete'))

deleteTask(id);



if(e.target.classList.contains('edit'))

editTask(id);

}

);



filters.forEach(btn=>{

btn.addEventListener(

'click',

()=>{

filter=btn.dataset.filter;

render();

}

);

});



clearBtn.addEventListener(

'click',

()=>{

todos=todos.filter(

t=>!t.completed

);

save();

render();

}

);



darkBtn.addEventListener(

'click',

()=>{

document.body.classList.toggle(

'dark'

);

}

);



render();