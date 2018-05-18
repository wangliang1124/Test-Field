require.config({
  paths: {
      "jquery": "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min",
      "underscore": 'underscore_1.9.0'
    }
});

require(['jquery', 'underscore', 'math'], function($, _, math) {
  console.log($('*'))
  _.each([1, 2, 3], function(v) {
    console.log(v)
  })
  console.log(math.add(3333,99999999999))
})