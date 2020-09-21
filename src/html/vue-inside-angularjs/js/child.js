const childComponent = Vue.component("childComponent", {
  data() {
    return {
      model: {
        name: "Lyall",
        surname: "van der :Linde",
        age: 34,
      },
    };
  },
  template: "#x-child-template",
});
