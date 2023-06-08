//사용자 등록부터
document.querySelectorAll('#user-list tr').forEach(el=>{
    el.addEventListener('click', ()=>{
        const id = el.querySelector('td').textContent;
        getComment(id);
    });
});
//사용자 로딩 - 
async function getUser(){
    try {
        const response = await axios.get('/users');
        const users = response.data; //[{},{},{}] 형식임
        // debugger;
        /*
        users
        [
            모델이 설정해준대로 나옴
            {name:'kyh', age:32, married:true},
            {name:'khj', age:28, married:true},
            {name:'kju', age:1, married:false}
        ]

        */
        console.log("users", users);
        const tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML='';
        
        users.map((user)=>{
        //user는 users 배열의 각각의 객체임
        //{id:1, name:'김영호', age:32, married:true, comment:null,...}
        //id에 접근하고자 할 때 user.id하면 된다
            const row = document.createElement('tr');
            row.addEventListener('click',()=>{
                getComment(user.id);
                //예를들어 1번 아이디를 클릭하면
                //getComment(1);로 호출된다`
            });
            //row cell plus
            let td = document.createElement('td');
            td.textContent = user.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.married ? '기혼' : '미혼';
            row.appendChild(td);
            tbody.appendChild(row);
        });
    } catch(err) {
        console.error(err);
    }
}


//Q이 함수의 선언이 곧 호출은 아닐텐데 알아보자
async function getComment(id){
    try {
        const res = await axios.get(`/users/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML='';
        comments.map(comment=>{
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = comment.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.User.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);
            td = document.createElement('td');
            const edit = document.createElement('button');
            edit.textContent='수정';
            edit.addEventListener('click', async()=>{
                const newComment = prompt('수정할 내용');
                if(newComment === null){
                    return;
                }
                if(!newComment){
                    return alert('내용 필수');
                }
                try {
                    await axios.patch(`/comments/${comment.id}`, {comment : newComment});
                    getComment(id);
                } catch (err) {
                    console.error(err);
                }
            });
            td.appendChild(edit);
            row.appendChild(td);
            td = document.createElement('td');
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async()=>{
                if(!confirm('지우겠습니까?')){
                    return;
                }
                try {
                    await axios.delete(`/comments/${comment.id}`);
                    getComment(id);
                } catch (err) {
                    console.error(err);
                }
            });
            td.appendChild(remove);
            row.append(td);
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}

//사용자등록에서 submit 눌렀을 때
document.getElementById('user-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = e.target.name.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;
    if(!name){
        return alert('이름을 입력하시오');
    }
    if(!age){
        return alert('나이를 입력하세요');
    }
    try {
        await axios.post('/users', {name, age, married});
        getUser();
    } catch (err) {
        console.error(err);
    }
    e.target.name.value='';
    e.target.age.value='';
    e.target.married.checked =false;
});

document.getElementById('comment-form').addEventListener('submit',async e=>{
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if(!id){
        return alert('id를 입력하세요');
    }
    if(!comment){
        return alert('댓글을 입력하세요');
    }
    try {
        await axios.post('/comments',{id, comment});
        getComment(id);
    } catch (err){
        console.error(err);
    }
    e.target.userid.value= '';
    e.target.comment.value='';
});