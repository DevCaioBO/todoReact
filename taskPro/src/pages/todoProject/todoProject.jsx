import {useRef,useEffect,useState} from 'react';
import "../../CSS/todoProject.css";
import "../../index.css"
import penEdit from "../../assets/img/pen.png";
import delEdit from "../../assets/img/bin.png";
import finishedTask from "../../assets/img/glass.png";
import checked from "../../assets/img/checked.png";

export default function TodoProject(){
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var [tarefas, setTasks] = useState([]);
    var [tarefasFiltro, setFiltro] = useState([]);
    var [values, setValues] = useState("");
    var [valor, setValor] = useState("");
    
    const inputTasks = useRef();
    const inputTaskse = useRef();
    const inputAlterRefs = useRef({}); // Armazena refs dinâmicas para cada input de alteração

    function SaveOnLocalStorage(tasks){
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function setIde() {
        var IndexLatest = localStorage.getItem("taskIde");
        if (IndexLatest === "NaN"){
            localStorage.setItem("taskIde", 0);
            return localStorage.getItem("taskIde");
        }
        tasks.push(JSON.stringify(localStorage.getItem("taskIde")));
        IndexLatest++;
        localStorage.setItem("taskIde", IndexLatest);
        return localStorage.getItem("taskIde");
    }

    function CompletedTasksTarget(id) {
        const updatedTasks = tarefas.map(task =>
            task.id === id ? { ...task, stats: task.stats === "complete" ? "pending" : "complete" } : task 
        );

        SaveOnLocalStorage(updatedTasks);
        setTasks(updatedTasks);
        location.reload();
    }

    function ChangeTasksTarget(id) {
        const updatedTasks = tarefas.map((prevTask) => 
            prevTask.id === id 
                ? {
                    ...prevTask, 
                    nome: inputAlterRefs.current[id]?.value || prevTask.nome, // Usa o valor do input correspondente à tarefa
                    modify: prevTask.modify === "padrão" ? "mudando" : "padrão"
                } 
                : prevTask
        );
        
        SaveOnLocalStorage(updatedTasks);
        setTasks(updatedTasks);
    }

    function AlterTask(id) {
        ChangeTasksTarget(id);
    }

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
            setFiltro(JSON.parse(storedTasks));
        }
    }, []);

    const CreateTask = (e) => {
        e.preventDefault();
        const taskName = inputTasks.current.value;
        const StorageAtual = JSON.parse(localStorage.getItem("tasks"));
        if (valor !== "") {
            const newTask = {
                id: setIde(),
                nome: valor,
                stats: "pending",
                modify: "padrão"
            };
            
            const updatedTasks = [...tarefas, newTask];
            setTasks(updatedTasks);
            SaveOnLocalStorage(updatedTasks);
            inputTasks.current.value = "";
            location.reload();
        }
    }

    function DeleteTask(id) {
        const updatedTasks = tarefas.filter(task => task.id !== id);
        setTasks(updatedTasks);
        SaveOnLocalStorage(updatedTasks);     
        location.reload();
    }
    
    function SearchTask(nome) {
        const updatedTasks = tarefas.filter(task => task.nome.toLowerCase() === nome.toLowerCase());
        if (inputTasks.current.value !== "") {
            setFiltro(updatedTasks);
        } else {
            location.reload();
        }
    }

    return (
        <div id="bodyTasks">
            <div id="grouperAll">
                <div id="InputAddTaskBody">
                    <input id="inputValor" type="text" autoComplete="off" placeholder="Digite a tarefa" ref={inputTasks} value={valor} onChange={(e) => setValor(e.target.value)} />
                    <button id="buttonAdd" onClick={CreateTask}>+</button>
                    <input id="inputValues" type="text" autoComplete="off" placeholder="Pesquise" ref={inputTaskse} value={values} onChange={(e) => setValues(e.target.value)} />
                </div>
            </div>

            <div id="showTasks">
                <ul id="DisplayBody">
                    {tarefas.filter((todo) => todo.nome.includes(values)).map((task) => (
                        <div key={task.id} id="bodyColumnTask">
                            <li className={task.stats === "complete" ? "completed" : "normal"}>
                                <div>
                                    <h2 className={task.modify === "padrão" ? "mudar" : "mudou"}>{task.nome}</h2>
                                    <div id="InputAlt" className={task.modify === "padrão" ? "mudou" : "mudar"}>
                                        <input 
                                            type="text" 
                                            ref={(el) => inputAlterRefs.current[task.id] = el} // Atribui uma ref única para cada tarefa
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button className="AltButton" onClick={() => AlterTask(task.id)}><img src={penEdit} alt="Editar" /></button>
                                    <button className="DelButton" onClick={() => DeleteTask(task.id)}><img src={delEdit} alt="Excluir" /></button>
                                </div>
                            </li>
                            <button className={task.stats === "complete" ? "finishedButton" : "CompleteButton"} onClick={() => CompletedTasksTarget(task.id)}>
                                <img src={task.stats === "complete" ? checked : finishedTask} alt="Completar" />
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}