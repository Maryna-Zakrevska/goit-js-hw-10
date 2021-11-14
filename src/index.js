import "./css/styles.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import debounce from "lodash/debounce";
import { fetchCountries } from "./js/fetchCountries";

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryInfoBox = document.querySelector(".country-info");
const countryList = document.querySelector(".country-list");

function resetMarkup() {
  countryList.innerHTML = "";
  countryInfoBox.innerHTML = "";
}

searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY, { leading: false }));

function onInput() {
  const name = searchBox.value.trim();
  if (name.length >= 1) {
    fetchCountries(name)
      .then((res) => {
        if (res.length > 10) {
          resetMarkup();
          return Notify.info("Too many matches found. Please enter a more specific name.");
        }

        updateUI(res, countryList, countryInfoBox);
      })

      .catch((error) => {
        Notify.failure("Oops, there is no country with that name");
        resetMarkup();
      });
  }
}

function updateUI(countries, list, infoBox) {
  resetMarkup();

  if (countries.length < 1) {
    return;
  }

  if (countries.length === 1) {
    resetMarkup();

    const countryDesc = countries
      .map(
        ({ name, flags, capital, population, languages }) =>
          `
  <img class="country__flag" src="${flags.svg}" alt="Flag of ${name}">
  <p class="country__name">${name}</p>
  <p class="country__capital">Capital: ${capital}</p>
  <p class="country__population">Population: ${population}</p>
  <p class="country__languages">Languages:
  ${languages.map((el) => el.name).join(", ")}</p>
      `,
      )
      .join("");
    infoBox.insertAdjacentHTML("beforeend", countryDesc);

    return;
  }

  const countriesMarkup = countries
    .map(
      ({ name, flags }) =>
        `
<li>
  <img class="country__item--flag" src="${flags.svg}" alt="Flag of
  ${name}">
  <span class="country__item--name">${name}</span>
</li>
    `,
    )
    .join("");

  list.insertAdjacentHTML("beforeend", countriesMarkup);
}
