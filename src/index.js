import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchArea = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchArea.addEventListener('input', debounce(onSearchChange, DEBOUNCE_DELAY));

function onSearchChange(e) {
  const searchName = e.target.value.trim();
  clearMarkup();

  if (searchName !== '') {
    fetchCountries(searchName)
      .then(data => renderCountryMarkup(data))
      .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name.'));
  }
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryMarkup(data) {
  if (data.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  } else if (data.length >= 2 && data.length <= 10) {
    renderCountryList(data);
    return;
  } else {
    renderCountryInfo(data);
    return;
  }
}

function renderCountryList(data) {
  const countryItem = data
    .map(item => {
      return `<li class="country__item">
          <img class="country__flag" src="${item.flags.svg}" alt="Country flag" width="50px" />
          <p class="country__name">${item.name.official}</p>
      </li>`;
    })
    .join('');

  countryList.innerHTML = countryItem;
}

function renderCountryInfo(data) {
  const specificCountry = data.map(item => {
    console.log(Object.values(item.languages));
    return `<div class="country-info__main">
        <img class="country__flag" src="${item.flags.svg}" alt="Country flag" width="50px" />
        <h2 class="country__name--main">${item.name.official}</h2>
      </div>
      <p class="country__spec"><b>Capital: </b>${item.capital}</p>
      <p class="country__spec"><b>Population: </b>${item.population} inhabitants</p>
      <p class="country__spec"><b>Languages: </b>${Object.values(item.languages).join(', ')}</p>`;
  });

  countryInfo.innerHTML = specificCountry;
}
