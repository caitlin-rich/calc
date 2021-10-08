import React, { useState } from "react";
import "./App.css";

// Remaining To-Do
// -negative numbers w/ multiplication and division
// -parentheses
// -this is a MONSTER, try and optimize - if we need 175 lines we need 175 lines, but i bet we can condense and still have it be clean, readable code!
// -review comments and layout
// -multiplication w/ parenthesis? not called for, but might be fun
// -exponents if you have time bc might as well go for the full PEMDAS

function App() {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState(null);

  function onSubmit(e) {
    e.preventDefault();

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
          "Invalid input. Problem can only contain numbers, parentheses, and the operators +, -, *, and /."
        );
        return;
      }

      //NUMBERS HANDLERS
      if (numbers.includes(currChar)) {
        if (tempNum !== null) {
          tempNum += currChar;
        }
        if (tempNum === null) {
          tempNum = currChar;
        }
      }

      //NEGATIVE NUMBER HANDLERS

      //for addition and subtraction, this approach makes sense - but it doesn't work with multiplication and division. 
     //If there is a negative sign, and the second-to-last entry in mathProblems is a - (indicating that the number we're operating with is also a negative), then we can just pop both thta negative and the current negative off bc they (ha) negate each other. 
     //if the second-to-last-entry is NOT a negative, indicating it's a positive number...then we remove the negative and then multiply the result by (-1)? I'm not sure how we'd do that. 
     //Would it make sense to just do the math here instead of passing it down...? so if it's 8/-4, if 8 is positive...no, that won't work bc we don't have the next number yet. which is why we're doing all this in the first place, to get the whole thing. 

     //THIS BRINGS UP - could i do the running total AS we parse the string? That sounds like something to look at after we figure out full functionality.
     
     //HOLD ON AM I AGGRESIVELY OVERTHINKING THIS
     //IT SEEMS LIKE THE JAVASCRIPT OPERATOR SHOULD JUST LIKE DO THE THING. I DONT THINK I NEED TO ADD THINGS SPECIFICALLY AS NEGATIVE NUMBERS I THINK THEY CAN JUST BE ADDED AS OPERATORS? 
     //I mean I think i'd have to handle it in the calcuations segment, but like, that feels like it makes more sense??? 

      //handles negative number if the first number in the equation is negative
      if (currChar === "-" && i === 0) {
        tempNum = 0;
      }

      //handles negative numbers when - isn't the first character in the equation
      //this if statement checks to see if the - is a second operator, AKA a negative number
      if (currChar === "-" && operators.includes(valueWithoutSpaces[i - 1])) {

        //if a problem is -2*-2 or -2/-2: if the second operator is -, we check to see if there's a negative (not a minus) ahead of the previous number. 
        



        //If the equation is 2--2, that cancels out to 2+2, so we replace the two "-" with one "+"
        if (valueWithoutSpaces[i - 1] === "-") {
          mathProblem.pop();
          mathProblem.push("+");
        }

        //this might have to be tweaked, but currently if it's NOT --, it adds a zero in to make the negative work (aka 2+-2 becomes 2+0-2)
        //this is why it's only working with addition and subtraction currently. 2/-2 !== 2/0-2! 
        if (valueWithoutSpaces[i - 1] !== "-") {
          mathProblem.push(0);
          mathProblem.push(currChar);
        }
      }

      //OPERATOR HANDLERS
      if (operators.includes(currChar)) {
        //Displays error if more than two operators in a row
        if (
          operators.includes(valueWithoutSpaces[i - 1]) &&
          operators.includes(valueWithoutSpaces[i + 1])
        ) {
          setResult("Invalid input. Too many operators.");
          return;
        }

        if (currChar !== "-" && operators.includes(valueWithoutSpaces[i - 1])) {
          setResult("Invalid input.");
          return;
        }

        if (tempNum !== null) {
          let tempParsed = parseFloat(tempNum);
          mathProblem.push(tempParsed);

          tempNum = null;
        }
        if (!operators.includes(valueWithoutSpaces[i - 1])) {
          mathProblem.push(currChar);
        }
      }

      if (i === valueWithoutSpaces.length - 1) {
        if (!numbers.includes(currChar)) {
          setResult("Equation cannot end with an operator.");
          return;
        }
        let tempParsed = parseFloat(tempNum);
        mathProblem.push(tempParsed);
        tempNum = null;
      }
    }

    //CALCULATIONS!
    let runningTotal = null;

    //this handles the order of operations - this while loop does the multiplication and division first, and then once that's done, we go down to the addition and subtraction loop
    //NEED TO FIX UP W/ THE NEGATIVE NUMBERS FOR MULTIPLICATION AND DIVISION
    while (mathProblem.includes("*")) {
      let total = 0;
      let operatorIndex = mathProblem.findIndex(e => e === "*");
      total = mathProblem[operatorIndex - 1] * mathProblem[operatorIndex + 1];
      mathProblem[operatorIndex] = total;
      mathProblem.splice(operatorIndex - 1, 1);
      mathProblem.splice(operatorIndex, 1);
    }

       // if (mathProblem[operatorIndex+1] === "-" && mathProblem[operatorIndex-2] === "-" && (operators.includes(mathProblem[operatorIndex-3]) || operatorIndex-3 === 0)){
      //   mathProblem.splice(operatorIndex + 1, 1) //removes the immediately following "-"
      //   mathProblem.splice(operatorIndex - 2, 1) //removes the preceding "-"
      //   operatorIndex = mathProblem.findIndex(e => e === "*") //updates the operator index with new index
      // }

    while (mathProblem.includes("/")) {
      let total = 0;
      let operatorIndex = mathProblem.findIndex(e => e === "/");
      total = mathProblem[operatorIndex - 1] / mathProblem[operatorIndex + 1];
      mathProblem[operatorIndex] = total;
      mathProblem.splice(operatorIndex - 1, 1);
      mathProblem.splice(operatorIndex, 1);
    }

    //handles addition and subtraction once any multiplication and division is done
    for (let i = 0; i < mathProblem.length; i++) {
      let currChar = mathProblem[i];

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
