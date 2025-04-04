import { useState, useRef, useEffect } from "react";
import "./App.css";
import styled, { ThemeProvider } from "styled-components";

const light = {
  background: "#eee",
  color: "#333",
};

const dark = {
  background: "#333",
  color: "#fff",
};

const Container = styled.div<{ theme: { background: string; color: string } }>`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  width: 500px;
  padding: 20px;
  margin: 50px auto;
  border-radius: 10px;
`;

function App() {
  const [theme, setTheme] = useState(light);
  const [todos, setTodos] = useState<{ id: number; text: string; level: number; time: number; done: boolean  }[]>([]);
  const [input, setInput] = useState("");
  const [level, setLevel] = useState(1);
  const [sort, setSort] = useState<"latest" | "oldest" | "high" | "low">("latest");
  const [on, setOn] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectTodo, setSelectTodo] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState<"all" | "incomplete" | "complete">("all");
  const [selected, setSelected] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [level]);

  const toggle = () => setTheme((before) => (before === light ? dark : light));

  const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editMode && selectTodo !== null) {
        setTodos((before) =>
          before.map((todo) =>
            todo.id === selectTodo ? { ...todo, text: input, level } : todo
          )
        );
        setEditMode(false);
        setSelectTodo(null);
        setInput("");
      } else if (input.trim()) {
        const newTodo = {
          id: Date.now(),
          text: input,  
          level,
          time: Date.now(),
          done: false,
        };
        setTodos([...todos, newTodo]);
        setInput("");
      }
    }
  };

  const sortTodos = [...todos].sort((a, b) => {   /* sort문 배열 계속 반복 */
    if (sort === "latest") return b.time - a.time;
    if (sort === "oldest") return a.time - b.time;
    if (sort === "high") return b.level - a.level;
    if (sort === "low") return a.level - b.level;
    return 0;
  });

  const onOff = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setOn(true);
    setSelectTodo(id);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const close = () => setOn(false); /* 같은 함수를 조작해야함 */
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);  
  }, []);

  const done = () => {
    if (selectTodo !== null) {
      setTodos((before) =>
        before.map((todo) =>
          todo.id === selectTodo ? { ...todo, done: !todo.done } : todo
        )
      );
      setOn(false);
      setSelectTodo(null);
    }
  };

  const edit = () => {
    if (selectTodo !== null) {
      const todoToEdit = todos.find((todo) => todo.id === selectTodo);
      if (todoToEdit) {
        setEditMode(true);
        setInput(todoToEdit.text);
        setLevel(todoToEdit.level);
        setOn(false);
      }
    }
  };

  const remove = () => {
    if (selectTodo !== null) {
      setTodos((before) => before.filter((todo) => todo.id !== selectTodo));
      setOn(false);
      setSelectTodo(null);
    }
  };

  const filter = sortTodos.filter((todo) => {   /* 여러 번 */
    if (tab === "incomplete") return !todo.done;
    if (tab === "complete") return todo.done;
    return true;
  });

  const toggleSelect= (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setSelected([]);
  }, [editMode])

  const selectAll = () => {
    if (selected.length === filter.length) {
      setSelected([]);
    } else {
      setSelected(filter.map((todo) => todo.id));
    }
  };

  const doneSelected = () => {
    setTodos((before) =>
      before.map((todo) =>
        selected.includes(todo.id) ? { ...todo, done: !todo.done } : todo
      )
    );
    setSelected([]);
    setOn(false);
  };
  
  const removeSelected = () => {
    setTodos((before) => before.filter((todo) => !selected.includes(todo.id)));
    setSelected([]);
    setOn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <h1>To-Do-List</h1>
        <div className="input">
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={addTodo}
          />
          <select onChange={(e) => setLevel(Number(e.target.value))} value={level}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="sort_options">
          <span onClick={() => setSort("latest")}>최신순</span>
          <span onClick={() => setSort("oldest")}>오래된순</span>
          <span onClick={() => setSort("high")}>높은순</span>
          <span onClick={() => setSort("low")}>낮은순</span>
          <span className="theme" onClick={toggle}>테마</span>
        </div>
        <div className="tab_menu">
          <div onClick={() => setTab("all")} className={tab === "all" ? "active" : ""}>전체</div>
          <div onClick={() => setTab("incomplete")} className={tab === "incomplete" ? "active" : ""}>미완료</div>
          <div onClick={() => setTab("complete")} className={tab === "complete" ? "active" : ""}>완료</div>
          {editMode ? (
            <ul className="edit">
              <li onClick={() => selectAll()}>전체선택</li>
              <li onClick={() => setEditMode(false)}>취소</li>
            </ul>
          ) : (
            <ul className="edit">
              <li onClick={() => setEditMode(true)}>편집</li>
            </ul>
          )}
        </div>
        <div className="list">
          {filter.map((todo) => (
            <div key={todo.id} 
            className="todo"
            onContextMenu={(e) => onOff(e, todo.id)} 
            onClick={() => editMode && toggleSelect(todo.id)} 
            style={{ opacity: todo.done ? 0.5 : 1, backgroundColor: selected.includes(todo.id) ? "#ddd" : ""}}>
              <p>
                {todo.text} / 중요도: {todo.level} / {new Date(todo.time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {on && selectTodo !== null && (
          <div className="setting" style={{ top: position.y, left: position.x }}>
            <span onClick={done}>완료</span>
            <span onClick={edit}>수정</span>
            <span onClick={remove}>삭제</span>
          </div>
        )}
        {on && editMode && selected.length > 0 && (
          <div className="setting" style={{ top: position.y, left: position.x }}>
            <span onClick={doneSelected}>완료</span>
            <span onClick={removeSelected}>삭제</span>
          </div>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;