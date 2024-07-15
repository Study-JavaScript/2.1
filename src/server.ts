import http from 'http';
import fs from 'fs';
import path from 'path';
import { addTask, listTasks, completeTask, deleteTask } from './app';
import { debounceHandler } from './debounce';

function handleGetTasks(req: http.IncomingMessage, res: http.ServerResponse) {
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}


function handleAddTask(req: http.IncomingMessage, res: http.ServerResponse) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { description }: { description: string } = JSON.parse(body);
        addTask(description);
        const tasks = listTasks();
        res.end(JSON.stringify(tasks));
    });
}
//En las sig., buscamos el id que es el 3r argumento contando el dominio(localhost)
function handleCompleteTask(req: http.IncomingMessage, res: http.ServerResponse) {
    const taskId = parseInt(req.url!.split('/')[2]);
    completeTask(taskId);
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}

function handleDeleteTask(req: http.IncomingMessage, res: http.ServerResponse) {
    const taskId = parseInt(req.url!.split('/')[2]);
    deleteTask(taskId);
    const tasks = listTasks();
    res.end(JSON.stringify(tasks));
}

const debouncedHandleGetTask = debounceHandler(handleGetTasks, 2000)
const debouncedAddTask = debounceHandler(handleAddTask, 2000)
const debouncedCompleteTask = debounceHandler(handleCompleteTask, 2000)
const debouncedDeleteTask = debounceHandler(handleDeleteTask, 2000)






const server = http.createServer((req, res) => {
    const publicPath = path.resolve(__dirname, '..', 'public');

    const serveStaticFile = (filePath: string) => {
        fs.createReadStream(filePath).pipe(res);
    };

    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(publicPath, 'index.html');
        serveStaticFile(filePath);
    }
    else if (req.url?.startsWith('/public/') || req.url?.startsWith('/dist/')) {
        const filePath = path.join(__dirname, '..', req.url);
        serveStaticFile(filePath);
    } 
    else if (req.url === '/tasks' && req.method === 'GET') {
        debouncedHandleGetTask(req, res);
    } else if (req.url?.startsWith('/tasks/') && req.method === 'PUT') {
        debouncedCompleteTask(req, res);
    } else if (req.url?.startsWith('/tasks/') && req.method === 'DELETE') {
        debouncedDeleteTask(req, res);
    } else if (req.url === '/tasks' && req.method === 'POST') {
        debouncedAddTask(req, res);
    }  else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 4001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
