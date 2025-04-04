# To_do_list

테마 변경

const Container = styled.div<{ theme: { background: string; color: string } }>`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};

props는 컴포넌트에서 전달되는 값
props = {
    theme: { 
        background:
        color
    }
}

const [theme, setTheme] = useState(light); 기본 라이트 상태

const toggle = () => setTheme((prev) => (prev === light ? dark : light));

prev 이전 값, 갑이 light면 dark. dark면 light

const [todos, setTodos] = useState<{ id: number; text: string; level: number; time: number; done: boolean  }[]>([]); 타입은 배열이고 초기값이 빈 배열

const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (editMode && selectTodo !== null) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
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

  ...todo 기존 배열 복사하는거