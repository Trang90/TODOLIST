/* eslint-disable no-alert */
const postsList = document.querySelector('.content__toDoList');
const CHECK = 'icon-ok-circled';
const UNCHECK = 'icon-circle-empty';
const LINE_THROUGH = 'lineThrough';
const url = 'http://dev-01.fida.local:9099/unsecured/TODO';
const titleValue = document.getElementById('input_beschreibung');
const dateValue = document.getElementById('input_datum');
const btnSubmit = document.getElementById('add');
const btnClear = document.getElementById('clear');
const TODAY = document.getElementById('date');
const d = new Date();

// format DD.MM.YYY
const strDate = `${(d.getDate() < 9 ? '0' : '') + d.getDate()}.${
  d.getMonth() < 9 ? '0' : ''
}${d.getMonth() + 1}.${d.getFullYear()}`;

// shows todays date
TODAY.append(strDate);

let output = '';
// load items into UI
const renderPosts = posts => {
  posts.forEach(post => {
    const LINE = post.erledigt ? LINE_THROUGH : '';
    const DONE = post.erledigt ? CHECK : UNCHECK;
    output += ` 
        <div class="content__toDoList--col6 ${LINE}" data-id=${post.id} data-erledigt=${post.erledigt}>
          <i class="${DONE} co" id="done-post"></i>
          <span class="text">${post.beschreibung}</span>
          <span class="day">${post.erledigungsdatum}</span>
          <i class="icon-trash-empty" id="delete-post"></i>
        </div>
        `;
  });
  postsList.innerHTML = output;
};
// clear input field
btnClear.addEventListener('click', e => {
  e.preventDefault();

  document.getElementById('input_beschreibung').value = '';
  document.getElementById('input_datum').value = '';
});

// METHOD: GET. Get items from backend
fetch(url)
  .then(res => res.json())
  .then(data => renderPosts(data));

// METHOD: POST. Add more to-do task

function addTask() {
  const TITEL = titleValue.value;
  let dueDay = dateValue.value;

  if (dueDay === '') {
    dueDay = strDate;
  }

  if (TITEL) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify({
        beschreibung: TITEL,
        erledigungsdatum: dueDay,
        erledigt: false,
        userID: 1,
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          alert(text);
        } else {
          return res.json();
        }
        return null;
      })

      .then(data => {
        const dataArr = [];
        dataArr.push(data);
        renderPosts(dataArr);
        // console.log(data);
      });
  } else {
    alert('Bitte die Beschreibung eintragen!');
  }
}

// click on Done or Trash icon
postsList.addEventListener('click', e => {
  const delButtonIsPressed = e.target.id === 'delete-post';
  const doneButtonIsPressed = e.target.id === 'done-post';

  const { id } = e.target.parentElement.dataset;
  const erledigt = e.target.parentElement.dataset.erledigt === 'true';

  // Delete - Remove
  // METHOD:DELETE
  if (delButtonIsPressed) {
    fetch(`${url}/${id}`, {
      method: 'DELETE',
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text();
        alert(text);
      } else {
        return window.location.reload(); // reload website to update UI
      }
      return null;
    });
  }

  // offen nach erledigt
  // METHOD:PUT
  if (doneButtonIsPressed && !erledigt) {
    const parent = e.target.parentElement;
    const titleContent = parent.querySelector('.text').textContent;
    const dateContent = parent.querySelector('.day').textContent;

    // console.log(titleContent, dateContent);

    titleValue.value = titleContent;
    dateValue.value = dateContent;

    fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        beschreibung: titleValue.value,
        erledigungsdatum: dateValue.value,
        erledigt: !erledigt,
        userID: 1,
      }),
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text();
        alert(text);
      } else {
        return window.location.reload(); // reload website to update UI
      }
      return null;
    });
  } else if (doneButtonIsPressed && erledigt) {
    alert('Abgeschlossene TODOs können nicht wieder geöffnet werden!');
  }
});

function checkDate() {
  let input = dateValue.value;
  const validformat =
    /^\s*(3[01]|[12][0-9]|0[1-9])\.(1[012]|0[1-9])\.((?:20)\d{2})\s*$/; // check for format validity

  if (input === '') {
    input = strDate;
  }

  if (!validformat.test(input)) {
    alert(
      'Ungültiges Datumsformat. Bitte korrigieren!\nGültiges Format: TT.MM.JJJJ. Beispiel:\nRichtig: 11.03.2022\nFalsch: 10/03/2022',
    );
  } else {
    addTask();
  }
}

btnSubmit.addEventListener('click', e => {
  e.preventDefault();
  checkDate();
  document.getElementById('input_beschreibung').value = '';
  document.getElementById('input_datum').value = '';
});
