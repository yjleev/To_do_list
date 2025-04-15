import { useState } from "react";

function useTodo(){
    const [todos, setTodos] = useState<{ id: number; text: string; level: number; time: number; done: boolean}[]>([]);
    const [selectTodo, setSelectTodo] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [input, setInput] = useState("");
    const [level, setLevel] = useState(1);

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

    return {
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
      addTodo,
    };
}

export { useTodo }