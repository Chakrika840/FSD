const http=require('http');
const fs=require('fs');
const url=require('url');
let students=[];
try{
  students=require('./students.json');
}
catch(err){
  students=[];
}
function saveData(data)
{
  fs.writeFile('students.json',JSON.stringify(data,null,2),(err)=>{
    if(err) throw err;
  });
}
const server=http.createServer((req,res)=>{
  res.setHeader('Content-Type','text/html');
  const parsedUrl=url.parse(req.url,true);
  const path=parsedUrl.pathname;
  const query=parsedUrl.query;  
  if(req.method==='POST'&&path==='/student')
  {
    if(!query.id||!query.name)
    {
      res.statusCode=400;
      return res.end('Missing id or name');
    }
    const exists=students.find(s=>s.id===query.id);
    if(exists)
    {
      res.statusCode=409;
      return res.end('Student with this id already exists');  
    }
    const newStu={id:query.id,name:query.name};
    students.push(newStu);
    saveData(students); 
    return res.end('Student added successfully');
  }
  if(req.method==='GET'&&path==='/'){
    res.write('<h1>Welcome to REST Api</h1>');
    return res.end();
  }
  if(req.method==='GET'&&path==='/students')
  {
    fs.readFile('students.json',(err,data)=>{
      if(err)
      {
        res.statusCode=500;
        return res.end('Error reading data');
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.write(data);
      return res.end();
    })
    return;
  }
  if(req.method==='PUT'&&path==='/student'){
    if((!query.id)||(!query.name)){
      res.statusCode=400;
      return res.end('Missing id or name');
    }
    const student=students.find(s=>s.id===query.id);
    if(!student){
      res.statusCode=404;
      return res.end('Student not found');
    }
    else{
      student.name=query.name;
      saveData(students);
      return res.end('Student updated successfully'); 
    }
  }
  if(req.method==='DELETE'&&path==='/student'){
  
    if(!query.id){
      res.statusCode=400;
      return res.end('Missing id');
    }
    const index=students.findIndex(s=>s.id===query.id);
    if(index===-1){
      res.statusCode=404;
      return res.end('Student not found');
    } 
    else{
      students.splice(index,1);
      saveData(students);
      return res.end('Student deleted successfully');
    }
  }
   res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  
}
)
server.listen(3000,()=>{
  console.log('Server is running on port 3000');
});
