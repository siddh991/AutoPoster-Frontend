const signUpFormFields = {
    signUp: {
      email: {
        order: 1
      },
      password: {
        order: 2
      },
      confirm_password: {
        order: 3
      },
      name: {
        label: "First Name",
        order: 4
      },
      family_name: {
        label: "Last Name",
        order: 5
      },
      'custom:Company': {
        label: "Company",
        placeholder: "Enter your Company",
        order: 6
      },
      phone_number: {
        order: 7
      },
    },
  };
  
  export default signUpFormFields;
  