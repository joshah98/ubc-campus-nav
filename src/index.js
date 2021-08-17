import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

let intro = document.querySelector('.intro');
let findstuff = document.querySelector('.findstuff-header');
let fsSpan = document.querySelectorAll('.findstuff');
console.log(fsSpan);

window.addEventListener('DOMContentLoaded', () => {
  
  setTimeout(() => {
    fsSpan.forEach((span, i) => {

      setTimeout(() => {
        span.classList.add('active');
      }, (i+1) * 400);
    })

    setTimeout(() => {
      fsSpan.forEach((span, i) => {

        setTimeout(() => {
          span.classList.remove('active');
          span.classList.add('fade')
        }, (i+1) * 60);

      })
    }, 2000);

    setTimeout(() => {
      intro.style.top = '-100vh';
    }, 2000);

  });
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
