import styled from "styled-components";
import { useState } from "react";

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

function useMode () {
    const [theme, setTheme] = useState(light);
    
    const toggle = () => setTheme((before) => (before === light ? dark : light));

    return {toggle, theme}
}

export {Container, useMode}