// ! Ay Dizisi
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ! HTML eleman tanımlama
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const button = form.querySelector("button");

// Not güncelleme değişken
let isUpdate = false;
let updateId;

// LocalStorage'da veri varsa notları çek yoksa boş dizi oluştur
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// * add icon tıklama
addBox.addEventListener("click", () => {
  //Popup göster
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");

  // scroll engelle
  document.querySelector("body").style.overflow = "hidden";
});

// * close icon tıklama
closeIcon.addEventListener("click", () => {
  //Popup gizle
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  // scroll kaydır
  document.querySelector("body").style.overflow = "auto";

  // todo: güncelleme işlemi yapılmadan kapanırsa formu temizle
  form.reset();
  isUpdate = false;
  setTimeout(function () {
    popupTitle.textContent = "Add Note";
    button.textContent = "Add Note";
  }, 700);
});

// * Form gönderilince yapılan işlemler
form.addEventListener("submit", (e) => {
  //sayfa yenileme engelle
  e.preventDefault();

  let title = e.target[0].value.trim();
  let description = e.target[1].value.trim();

  if (title && description) {
    const date = new Date();
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();
    // note obje oluştur
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };

    //eğer güncelleme modu ise not güncelle yoksa yeni not ekle
    if (isUpdate) {
      notes[updateId] = noteInfo;
      isUpdate = false;
    } else {
      notes.push(noteInfo);
    }

    // obje locale ekleme
    localStorage.setItem("notes", JSON.stringify(notes));

    //Popup gizle
    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    popupTitle.textContent = "Add Note";
    button.textContent = "Add Note";
    // scroll kaydır
    document.querySelector("body").style.overflow = "auto";
  }
  //Formu temizle
  form.reset();
  showNotes(); //localdeki verileri ekrana basma
});
//Menu içinden Not güncelleme
function updateNote(noteId, title, description) {
  updateId = noteId;
  isUpdate = true;
  //Popup göster
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  popupTitle.textContent = "Update Note";
  button.textContent = "Update Note";
  form.elements[0].value = title;
  form.elements[1].value = description;
}

//Menu içinden Not silme
function deleteNote(noteId) {
  if (confirm("Silmek istiyor musunuz ?")) {
    //belirlenen notu kaldırma
    notes.splice(noteId, 1);
    //local den silme
    localStorage.setItem("notes", JSON.stringify(notes));

    //notları göster
    showNotes();
  }
}

//Menu içeriği(Üç nokta) gösterme
function showMenu(element) {
  element.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != element) {
      element.parentElement.classList.remove("show");
    }
  });
}

//Yeni not ekleme
function showNotes() {
  //Eğer notlar yoksa içeriği durdur
  if (!notes) return;

  //Önceden eklenen notları kaldır
  document.querySelectorAll(".note").forEach((li) => li.remove());

  notes.forEach((item, id) => {
    let newLi = `
    <li class="note">
        <!-- details -->
        <div class="details">
          <p>${item.title}</p>
          <span>${item.description}</span>
        </div>
        <!-- bottom-content -->
        <div class="bottom-content">
          <span>${item.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li onclick='updateNote(${id}, "${item.title}", "${item.description}")'><i class="bx bx-edit"></i>Edit</li>
              <li onclick='deleteNote(${id})'><i class="bx bx-trash"></i>Delete</li>
            </ul>
          </div>
        </div>
      </li>`;

    addBox.insertAdjacentHTML("afterend", newLi);
  });
}

//silme ve güncelleme fonksiyonları çağırma işlemleri
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("bx-trash")) {
    const noteId = parseInt(e.target.closest(".note").dataset.id, 10);
    deleteNote(noteId);
  } else if (e.target.classList.contains("bx-edit")) {
    //Düzenleme işlemi yapılacak Kapsam elemana eriş
    const noteElement = e.target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id, 10);
    const title = noteElement.querySelector("title").innerText;
    const description = noteElement.querySelector("description").innerText;
    updateNote(noteId, title, description);
  }
});

// Sayfa yüklendiğinde tüm notları render et
window.addEventListener("DOMContentLoaded", () => showNotes());
