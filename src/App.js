import React, { useState, useEffect } from 'react';
import {
  signalList,
  setSignalInParentheses,
  getValues,
  getParentheses,
  setNextEquation,
} from './handleFunctions.js';

export default function App() {
  const [equation, setEquation] = useState('');
  const [currentStepEquation, setCurrentStepEquation] = useState('');

  useEffect(() => {
    const div = document.getElementById('divResult');
    div.innerHTML = '';
    const ul = document.createElement('ul');
    div.appendChild(ul);

    // const arraySymbols = equation.split(/[a-z0-9\s]+/);
    let json = getParentheses(equation);
    console.log('json');
    console.log(json);
    const li = document.createElement('li');
    li.innerHTML = JSON.stringify(json);

    try {
      //1st multiply
      const mult = setNextEquation(json, '*');
      if (mult == null) {
        //2nd division
        const division = setNextEquation(json, '/');
        if (division != null) {
          json = division;
        }
      } else json = mult;
      // console.log(mult);
    } catch (err) {
      console.log(err);
    }
    const li2 = document.createElement('li');
    li2.innerHTML = JSON.stringify(json);
    ul.appendChild(li);
    ul.appendChild(li2);
    setCurrentStepEquation(json);
  }, [equation]);

  //Every line of equation result
  useEffect(() => {
    const ul = document.querySelector('#divResult ul');
    const li = document.createElement('li');
    li.innerHTML = JSON.stringify(currentStepEquation);
    ul.appendChild(li);
  }, [currentStepEquation]);

  //On change input
  function handleInput(event) {
    const { value } = event.target;
    const newValue = setSignalInParentheses(value);
    setEquation(newValue);
  }

  return (
    <>
      <header>Calculator</header>
      <main>
        <h1>Calculadora</h1>
        <input type="text" id="equation" onChange={handleInput} />
        <div id="divResult"></div>
        {equation}
      </main>
      <footer>
        <p>Desenvolvido por Matheus Garrido &copy; 2021</p>
      </footer>
    </>
  );
}
