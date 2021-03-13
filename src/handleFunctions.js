export const signalList = /[+-/*//\\/^]+/;

export function getParentheses(text) {
  let json2 = [];
  let i = 1;

  while (text.length > 0) {
    let positionStart = text.indexOf('(');
    //If has number at first
    console.log(text);
    if (positionStart > 0 && !text[0].match(signalList)) {
      const values = getValues(text);
      json2.push(values.result);
      text = values.nextString;
      // if (text[positionStart - 1].match(signalList)) positionStart--;
      // const value = text.substring(0, positionStart);
      // json2[`a${i}`] = {
      //   value: value,
      //   type: 'number',
      // };
      // text = text.substring(positionStart);
    }
    //If has ( at first OR at second but starting with signal
    else if (
      positionStart == 0 ||
      (text[0].match(signalList) && positionStart == 1)
    ) {
      let positionEnd = text.indexOf(')');
      let current = text.substring(0, positionEnd + 1);
      const countStart = current.split('(').length - 2;
      const countEnd = current.split('(').length - 2;
      //If parentheses has start and end
      if (countStart >= 1) {
        current = text.split(')', countStart + 1).join(')');
        positionEnd = current.length;
      }
      // else {
      //   json2['error'] = 'error';
      // }

      //If has )
      if (positionEnd >= 0) {
        console.log(text);
        let positionStartParentheses = positionStart + 1;
        let signal = null;
        if (text[0].match(signalList)) {
          signal = text[0];
        }
        const currentParenteses = text.substring(
          positionStartParentheses,
          positionEnd - positionStartParentheses + 2
        );
        //OK
        json2.push({
          value: getParentheses(currentParenteses),
          type: 'parentheses',
          signal: signal,
        });
        text = text.substring(positionEnd + 1);
      }
      //If doesn't have )
      else {
        text = '';
      }
    }
    //If doesn't have parenthesis
    //Or recursive parenthesis
    else {
      const values = getValues(text);
      json2.push(values.result);
      text = values.nextString;
    }
    i++;
  }
  console.log(json2);
  return json2;
}

export function setNextEquation(json, signal) {
  const multIndex = json.filter((element, index) => {
    element.index = index;
    // console.log(index);
    if (element.signal == signal) return element;
  });
  console.log(multIndex.length);
  // console.log(multIndex);
  if (multIndex.length == 0) return null;
  let sub = 0;
  multIndex.map((element) => {
    const index = element.index - sub;
    //If is on
    if (json[index - 1].type !== 'equation') {
      json[index - 1].value =
        json[index - 1].value + json[index].signal + json[index].value;
      json[index - 1].type = 'equation';
      json.splice(index, 1);
      sub++;
    }
  });
  return json;
}

//Set the * signal before and after the parenthesis if doesn't have another one signal
export function setSignalInParentheses(value) {
  let rewrittedValue = value.split('(');
  rewrittedValue.map((element, index) => {
    if (
      element !== '' &&
      !element[element.length - 1].match(signalList) &&
      index != rewrittedValue.length - 1
    ) {
      rewrittedValue[index] += '*';
    }
  });
  rewrittedValue = rewrittedValue.join('(');
  rewrittedValue = rewrittedValue.split(')');
  rewrittedValue.map((element, index) => {
    if (element !== '' && !element[0].match(signalList) && index != 0) {
      rewrittedValue[index] = '*' + rewrittedValue[index];
    }
  });
  rewrittedValue = rewrittedValue.join(')');
  return rewrittedValue;
}

//Get the value from a piece of text
export function getValues(text) {
  //Split by the signals
  const arrayValues = text.split(/[+-/*//\\/^(]+/, 2);
  let nextString = text.substring(arrayValues[0].length);

  let value = arrayValues[0];
  let signal = null;
  //If has signal before value
  if (arrayValues[0] == '') {
    nextString = text.substring(arrayValues[1].length + 1);
    value = arrayValues[1];
    signal = text[0];
  }
  if (value == '') {
    switch (signal) {
      case '+':
      case '-':
        value = 0;
        break;
      case '*':
      case '/':
        value = 1;
        break;
    }
  }
  let type = 'expression';
  if (/^[0-9]+$/.test(value)) {
    type = 'number';
  } else if (/^[a-zA-Z]+$/.test(value)) {
    type = 'variable';
  }
  return {
    result: {
      value: value,
      type: type,
      signal: signal,
    },
    nextString: nextString,
  };
}
