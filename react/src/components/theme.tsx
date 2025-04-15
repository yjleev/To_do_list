import styled from "styled-components";

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

export {light, dark, Container}