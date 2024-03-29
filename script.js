const incrIndex = document.getElementById('incrIndex');
const arrayList = document.getElementById('arrayList');
const numToFound = document.getElementById('numToFound');
const linear = document.getElementById('linear');
const random = document.getElementById('random');
const binary = document.getElementById('binary');
const multiple = document.getElementById('multiple');
const isFound = document.getElementById('isFound');
const indexCurrent = document.getElementById('indexCurrent');
const algoInfo = document.getElementById('algoInfo');
const autoButton = document.getElementById('autoButton');
const changeArray = document.getElementById('changeArray');
const modeButton = document.getElementById('modeButton');
const timeResult = document.getElementById('timeResult');
const resetStart = document.getElementById('resetAll');

/* Note on this project */
/* Life would be easier if I store the index in queue */
/* Push and pop the index */
/* Making it a little bit easier */
/* Storing current, defaulting the previous */

/* Setups */

let array = [];
let itemIndex = 0;
let tryFind = false;
let runningAuto = false;
let left;
let right;
let timeStart;
let timeEnd;

resetStart.addEventListener('click', () => {
  timeStart = performance.now();
  timeEnd = performance.now();

  itemIndex = 0;
  left = 0;
  right = array.length - 1;
  resetStyle();
  timeResult.textContent = 'Time took: 0.00s';
  isFound.textContent = '"Algorithm is the heart of machine."';
  isFound.style.backgroundColor = '';
});

function renderArray() {
  itemIndex = 0;
  array.length = 0;

  /* Reset */
  while (arrayList.firstChild) {
    arrayList.removeChild(arrayList.firstChild);
  }
  let arrCount = numToFound.value;
  array = Array.from({ length: arrCount }, () => Math.floor(Math.random() * 100) + 1).sort((a, b) => a - b);

  /* Default array */
  for (let i = 0; i < arrCount; i++) {
    const value = document.createElement('div');
    value.setAttribute('class', 'basis-6 grow inline-block text-center bg-neutral-500 rounded');
    value.setAttribute('id', `arrItem${i}`);
    value.textContent = array[i];
    arrayList.appendChild(value);
  }
  left = 0;
  right = array.length - 1;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(() => {
  changeArray.addEventListener('click', renderArray);

  renderArray();

  /* QOL improvements */
  linear.addEventListener(
    'click',
    () => (algoInfo.textContent = 'Linear search iterates the array by each step. Good for unsorted and uncategorized data. Slow and memory tasking.')
  );
  random.addEventListener('click', () => (algoInfo.textContent = 'Search randomly. Best for lucky people. Repeating, memory tasking, and unpredictable.'));
  binary.addEventListener('click', () => (algoInfo.textContent = 'Repeatedly divides the search scope in half. Ranked best for sorted data. Does not work for unsorted data.'));
  multiple.addEventListener('click', () => (algoInfo.textContent = 'Jumps multiple, performs linear search if current arr[x] is greater than x. Does not work for unsorted data'));
  /* Front and back search, add if I got time */

  /* Forward button functions */
  incrIndex.addEventListener('click', () => {
    let haveMode = linear.checked || random.checked || multiple.checked || binary.checked;
    if (!haveMode || numToFound.value == '') {
      numToFound.style.backgroundColor = '#ff9a9a';
      setTimeout(() => {
        numToFound.style.backgroundColor = '';
      }, 500);
    } else if (linear.checked) {
      linearSearch();
    } else if (random.checked) {
      randomSearch();
    } else if (multiple.checked) {
      multipleSearch();
    } else if (binary.checked) {
      binarySearch();
    }
  });

  /* Auto button */
  autoButton.addEventListener('click', async function () {
    let haveMode = linear.checked || random.checked || multiple.checked || binary.checked;
    if (!haveMode || numToFound.value == '') {
      numToFound.style.backgroundColor = '#ff9a9a';
      setTimeout(() => {
        numToFound.style.backgroundColor = '';
      }, 500);
    } else if (linear.checked) {
      autoFunc(linearSearch);
    } else if (random.checked) {
      autoFunc(randomSearch);
    } else if (multiple.checked) {
      autoFunc(multipleSearch);
    } else if (binary.checked) {
      autoFunc(binarySearch);
    }
  });
})();

async function autoFunc(mode) {
  timeStart = performance.now();
  runningAuto = true;

  /* Styling */
  autoButton.style.display = 'none';
  let stopButton = document.createElement('button');
  stopButton.textContent = 'Stop';
  stopButton.setAttribute('class', 'bg-yellow-600 px-3 rounded font-bold tracking-tight focus:bg-yellow-700 hover:bg-yellow-500 my-1');

  stopButton.addEventListener('click', () => {
    runningAuto = false;
    modeButton.removeChild(modeButton.lastChild);
    autoButton.style.display = 'inline-block';
  });
  modeButton.appendChild(stopButton);

  tryFind = false;
  while (true) {
    await delay(100);
    if (tryFind || runningAuto == false) {
      break;
    } else {
      mode();
    }
    /* Update time */
    timeEnd = performance.now();
    timeResult.textContent = 'Time took: ' + (timeEnd - timeStart) / 1000 + 's';
  }
}

function linearSearch() {
  resetStyle();
  if (numToFound.value != '') {
    const getItem = document.getElementById(`arrItem${itemIndex}`);
    if (numToFound.value == array[itemIndex]) {
      isFoundFun(getItem, isFound);
      tryFind = true;
    } else {
      notFound(getItem, isFound);
      tryFind = false;
    }

    indexCurrent.textContent = 'Current index : ' + itemIndex;
    itemIndex += 1;
    itemIndex = itemIndex % array.length;
  }
}

function multipleSearch() {
  resetStyle();
  if (numToFound.value != '') {
    const getItem = document.getElementById(`arrItem${itemIndex}`);
    if (numToFound.value == array[itemIndex]) {
      isFoundFun(getItem, isFound);
      tryFind = true;
    } else {
      notFound(getItem, isFound);
    }

    indexCurrent.textContent = 'Current index : ' + itemIndex + ' Jump length: ' + Math.floor(Math.sqrt(array.length));
    let youFound = true;
    if (youFound) {
      itemIndex += Math.floor(Math.sqrt(array.length));
    }

    if (array[itemIndex] > numToFound.value || itemIndex >= array.length) {
      if (youFound) {
        itemIndex -= Math.floor(Math.sqrt(array.length));
      }
      youFound = !linearSearch();
    }
    itemIndex = itemIndex % array.length;
  }
}

function randomSearch() {
  resetStyle();
  itemIndex = Math.floor(Math.random() * array.length);

  if (numToFound.value != '') {
    const getItem = document.getElementById(`arrItem${itemIndex}`);
    if (numToFound.value == array[itemIndex]) {
      isFoundFun(getItem, isFound);
      tryFind = true;
    } else {
      notFound(getItem, isFound);
    }
    indexCurrent.textContent = 'Current index : ' + itemIndex;
  }
}

function binarySearch() {
  resetStyle();

  const leftItem = document.getElementById(`arrItem${left}`);
  leftItem.style.backgroundColor = 'orange';
  leftItem.classList.add('jello-horizontal');
  setTimeout(() => leftItem.classList.remove('jello-horizontal'), 2000);

  const rightItem = document.getElementById(`arrItem${right}`);
  rightItem.style.backgroundColor = 'orange';
  rightItem.classList.add('jello-horizontal');
  setTimeout(() => rightItem.classList.remove('jello-horizontal'), 2000);

  itemIndex = Math.floor((left + right) / 2);
  const middleItem = document.getElementById(`arrItem${itemIndex}`);
  middleItem.style.backgroundColor = 'red';
  middleItem.classList.add('jello-horizontal');
  setTimeout(() => middleItem.classList.remove('jello-horizontal'), 2000);

  console.log(left, itemIndex, right);

  indexCurrent.textContent = 'Left : ' + left + ' Middle: ' + itemIndex + ' Right: ' + right;

  if (array[itemIndex] == numToFound.value) {
    tryFind = true;
    console.log('Found: ' + array[itemIndex]);
    const middleItem = document.getElementById(`arrItem${itemIndex}`);
    isFoundFun(middleItem, isFound);
  }

  if (array[itemIndex] < numToFound.value) {
    left = itemIndex + 1;
  } else {
    right = itemIndex - 1;
  }
  if (left > right) {
    left = 0;
    right = array.length - 1;
    itemIndex = Math.floor((left + right) / 2);
  }
}

function notFound(getItem, isFound) {
  getItem.style.backgroundColor = 'red';
  getItem.classList.add('slide-top');
  setTimeout(() => getItem.classList.remove('slide-top'), 2000);
  isFound.style.background = 'red';
  isFound.textContent = 'NOT HERE, BUT KEEP GOING!';
}

function isFoundFun(getItem, isFound) {
  getItem.style.background = 'rgb(33, 151, 33)';
  isFound.style.background = 'rgb(33, 151, 33)';
  isFound.textContent = 'YOU FOUND IT!';
  getItem.classList.add('slide-top');
  setTimeout(() => getItem.classList.remove('slide-top'), 2000);
}

function resetStyle() {
  for (let i = 0; i < array.length; i++) {
    const toDefaultItem = document.getElementById(`arrItem${i}`);
    toDefaultItem.style.background = '';
  }
}
