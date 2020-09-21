const helloComponent = Vue.component("hello-component", {
  props: {
    firstName: String,
    lastName: String,
  },
  render(h) {
    return (
      <span>
        Hi, {this.firstName} {this.lastName}
      </span>
    );
  },
});
