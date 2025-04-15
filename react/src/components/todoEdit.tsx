import {useTodo} from "./createTodo"
import { useState, useEffect } from "react";

function useEdit() {
    const {
        todos,
        setTodos,
        input,
        setInput,
        level,
        setLevel,
        selectTodo,
        setSelectTodo,
        editMode,
        setEditMode,
        addTodo
    } = useTodo();

    const [sort, setSort] = useState<"latest" | "oldest" | "high" | "low">("latest");
    const [on, setOn] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [tab, setTab] = useState<"all" | "incomplete" | "complete">("all");

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

    return {sortTodos,onOff,done,edit,remove}
}

export {useEdit}
