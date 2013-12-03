# chain.js


Make native DOM API chainable.

**Under development**.

### DEMO

See [test.html](test.html), this examples is based on the markup of that file.

This example is just a demonstration, it may not fit for real world code expectations.

```js
$(document.body)
  .firstElementChild() // grab the first input element
  .nextElementSibling() // grab the next input element
  .value('second input') // modifiy its value
  .parentNode() // the body
  .style('background-color', '#eee') // change the background color
  .querySelectorAll('#btn') // grab the #btn element
  .addEventListener('click', function () {
    alert('btn clicked!');
  })
  .dispatchEvent(new Event('click')) // trigger a click event on the #btn element
```
