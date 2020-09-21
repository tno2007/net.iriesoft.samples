const appComponent = Vue.component("appComponent", {
  props: {
    data: Object,
    total: Number,
    firstName: String,
    lastName: String,
    description: String,
    age: Number,
  },
  data() {
    return {};
  },
  template: "#x-parent-template",
  mounted() {},
  methods: {
    adjust() {
      this.data.total += 111;
    },
    updateFirstName() {
      this.$emit("new-first-name", "THE");
    },
    updateAge() {
      this.$emit("update-age", Math.random());
    },
  },
});

const app = angular.module("designer", ["ngVue"]);

//define a service named myService
app.service("myService", function () {
  this.message = "";
  this.setMessage = function (newMessage) {
    this.message = newMessage;
    return this.message;
  };
  this.total = "";
  this.sum = function (firstNumber, secondNumber) {
    this.total = firstNumber + secondNumber;
    return this.total;
  };
});

app.controller("SimpleController", function ($scope, myService) {
  //$scope.name = "Lyall";
  //$scope.serviceMsg = myService.setMessage("Hello, I'm From Service");
  //$scope.total = myService.sum(100, 100);
  this._a = 11;
  $scope.ngData = {
    data: {
      firstName: "Lyall",
      lastName: "van der Linde",
      total: myService.sum(Math.floor(Math.random() * 10 + 1), 100),
      age: this._a,
    },
  };

  this.vueData = $scope.ngData;
  /*
  this.vueData = {
    age: this._a,
  };
  */

  this.updateFirstName = (firstName) => {
    this.vueData.data.firstName = firstName;
  };

  this.updateAge = (age) => {
    console.log("age...", age);
    //this._a = age;
    $scope.ngData.data.age = age;
    this.vueData.age = age;
  };
});

app.value("appComponent", appComponent);
