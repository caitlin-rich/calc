import React, { useState } from "react";
import "./App.css";

//Current functionality:
//1. The program runs
//2. + and - for whole numbers
//3. + and - for all integers
//4. * and / for all integers
//5.1 Input validation
//5.2 Decimals


// Remaining Requirements
// 5.3 Parentheses
//// -I can use my previously written code for checking to see if parenthesis are balanced (and return an error if not), and then start at the innermost parens and solve outward with the code below. 

//Other To-Do
// -this is a MONSTER, try and optimize! I'm sure some of this can be condensed. It's so many loops right now! 
// -review comments and layout
// -multiplication w/ parenthesis instead of *? (aka 5(6+3) and not 5*(6+3)) Not called for, but might be fun
// -exponents if you have time bc might as well go for the full PEMDAS :)

function App() {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);

  function onSubmit(e) {
    e.preventDefault();

    if (!value) {
      setResult("Please enter an equation.");
      return;
    }

    //Gets rid of any spaces so we don't have to deal with them when parsing the string
    let tempNoSpacesArray = value.split(" ");
    let valueWithoutSpaces = tempNoSpacesArray.join("");

    //This initial loop takes our string and turns it into an array, with each array entry being either a number or operator
    let mathProblem = [];

    let tempNum = null;
    const operators = "+-*/";
    const numbers = "0123456789.";

    for (let i = 0; i < valueWithoutSpaces.length; i++) {
      const currChar = valueWithoutSpaces[i];

      if (
        !operators.includes(currChar) &&
        !numbers.includes(currChar) &&
        currChar !== " "
      ) {
        setResult(
          "Invalid input. Problem can only contain numbers and the operators +, -, *, and /. (Functionality for parentheses is under development."
        );
        return;
      }

      //NUMBER HANDLERS
      if (numbers.includes(currChar)) {
        if (tempNum !== null) {
          tempNum += currChar;
        }
        if (tempNum === null) {
          tempNum = currChar;
        }
      }

      //OPERATOR HANDLERS

      if (currChar === "-" && i === 0) {
        mathProblem.push(0);
        mathProblem.push(currChar);
      }

      if (
        (currChar === "*" || currChar === "/" || currChar === "+") &&
        i === 0
      ) {
        setResult("Invalid input. Equation cannot start with an operator.");
        return;
      }

      if (operators.includes(currChar) && i !== 0) {
        if (
          operators.includes(valueWithoutSpaces[i - 1]) &&
          operators.includes(valueWithoutSpaces[i + 1])
        ) {
          setResult("Invalid input. Too many operators.");
          return;
        }

        if (currChar !== "-" && operators.includes(valueWithoutSpaces[i - 1])) {
          setResult('Invalid input. Second operator can only be "-".');
          return;
        }

        if (tempNum !== null) {
          mathProblem.push(parseFloat(tempNum));
          tempNum = null;
        }

        mathProblem.push(currChar);
      }

      //Equation must end with a number
      if (i === valueWithoutSpaces.length - 1) {
        if (!numbers.includes(currChar)) {
          setResult("Equation cannot end with an operator.");
          return;
        }
        mathProblem.push(parseFloat(tempNum));
        tempNum = null;
      }
    }

    //CALCULATIONS!
    let runningTotal = null;

    //this handles the order of operations - the while loops do the multiplication and division first, and then once that's done, we go down to the addition and subtraction loop

    while (mathProblem.includes("*")) {
      let total = 0;
      let opIdx = mathProblem.findIndex(e => e === "*");

      //We need the leading zero for addition and subtraction, but don't want it for multiplication, but can't figure out what the upcoming operation is when we're parsing the original string (because we don't know how long the next number is yet) so this checks if there's a leading zero and deletes it.
      if (mathProblem[opIdx - 3] === 0 && opIdx - 3 === 0) {
        mathProblem.splice(0, 1);
        opIdx = mathProblem.findIndex(e => e === "*");
      }

      //Multiplying two negative numbers, ex. -5*-5
      if (
        mathProblem[opIdx + 1] === "-" &&
        mathProblem[opIdx - 2] === "-" &&
        (operators.includes(mathProblem[opIdx - 3]) || opIdx - 2 === 0)
      ) {
        mathProblem.splice(opIdx + 1, 1); //removes the immediately following "-"
        mathProblem.splice(opIdx - 2, 1); //removes the preceding "-"
        opIdx = mathProblem.findIndex(e => e === "*"); //updates the operator index with new index
      }

      //when multiplying one positive times one negative number, with positive number first, this updates the format from "5*-5" to "-5*5" so we can use the logic built in below.
      if (
        mathProblem[opIdx + 1] === "-" &&
        (opIdx - 1 === 0 || numbers.includes(mathProblem[opIdx - 3]))
      ) {
        mathProblem.splice(opIdx + 1, 1);
        mathProblem.splice(opIdx - 1, 0, "-");
        opIdx = mathProblem.findIndex(e => e === "*");
      }

      total = mathProblem[opIdx - 1] * mathProblem[opIdx + 1];

      //This (and the below 'if' statement) handle operating with one negative and one positive number
      if (mathProblem[opIdx - 2] === "-" && opIdx - 2 === 0) {
        total *= -1;
      }

      mathProblem[opIdx] = total;
      mathProblem.splice(opIdx - 1, 1);
      mathProblem.splice(opIdx, 1);

      if (mathProblem[opIdx - 2] === "-" && opIdx - 2 === 0) {
        mathProblem.splice(0, 1);
      }
    }

    while (mathProblem.includes("/")) {
      let total = 0;
      let opIdx = mathProblem.findIndex(e => e === "/");

      //We need the leading zero for addition and subtraction, but don't want it for division, but can't figure out what the upcoming operation is when we're parsing the original string (because we don't know how long the next number is yet) so this checks if there's a leading zero and deletes it.
      if (mathProblem[opIdx - 3] === 0 && opIdx - 3 === 0) {
        mathProblem.splice(0, 1);
        opIdx = mathProblem.findIndex(e => e === "/");
      }

      //Dividing two negative numbers, ex. -5/-5
      if (
        mathProblem[opIdx + 1] === "-" &&
        mathProblem[opIdx - 2] === "-" &&
        (operators.includes(mathProblem[opIdx - 3]) || opIdx - 2 === 0)
      ) {
        mathProblem.splice(opIdx + 1, 1);
        mathProblem.splice(opIdx - 2, 1);
        opIdx = mathProblem.findIndex(e => e === "/");
      }

      //when dividing one positive times one negative number, with positive number first, this updates the format from "5/-5" to "-5/5" so we can use the logic built in below.
      if (
        mathProblem[opIdx + 1] === "-" &&
        (opIdx - 1 === 0 || numbers.includes(mathProblem[opIdx - 3]))
      ) {
        mathProblem.splice(opIdx + 1, 1);
        mathProblem.splice(opIdx - 1, 0, "-");
        opIdx = mathProblem.findIndex(e => e === "/");
      }

      total = mathProblem[opIdx - 1] / mathProblem[opIdx + 1];

      //This (and the below 'if' statement) handle operating with one negative and one positive number
      if (mathProblem[opIdx - 2] === "-" && opIdx - 2 === 0) {
        total /= -1;
      }

      mathProblem[opIdx] = total;
      mathProblem.splice(opIdx - 1, 1);
      mathProblem.splice(opIdx, 1);

      if (mathProblem[opIdx - 2] === "-" && opIdx - 2 === 0) {
        mathProblem.splice(0, 1);
      }
    }

    //If problem only has multiplication or division, the problem will be solved at this point and we can return the result.
    if (!mathProblem.includes("+") && !mathProblem.includes("-")) {
      setResult(mathProblem);
      return;
    }

    //handles addition and subtraction once any multiplication and division is done
    for (let i = 0; i < mathProblem.length; i++) {
      let currChar = mathProblem[i];

      //this handles the '--' situation
      if (currChar === "-" && mathProblem[i + 1] === "-") {
        mathProblem.splice(i, 1);
        currChar = "+";
      }

      if (currChar === "+" && mathProblem[i + 1] === "-") {
        mathProblem.splice(i, 1);
        currChar = "-";
      }

      if (currChar === "+") {
        runningTotal
          ? (runningTotal += mathProblem[i + 1])
          : (runningTotal = mathProblem[i - 1] + mathProblem[i + 1]);
      }
      if (currChar === "-") {
        runningTotal
          ? (runningTotal -= mathProblem[i + 1])
          : (runningTotal = mathProblem[i - 1] - mathProblem[i + 1]);
      }
    }

    setResult(runningTotal);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Caitlin Rich - Vidmob Calculator Take Home Project, 2021</p>
      </header>
      <form onSubmit={e => onSubmit(e)}>
        <label id="calcinput">
          Input Problem Here:
          <input
            type="text"
            name="probleminput"
            onChange={e => setValue(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <p>Result:</p> <br />
      <p id="result">{result}</p>
    </div>
  );
}

export default App;
