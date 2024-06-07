### Sign-ip Module

Sign-up showcases key content as well as the primary action on the page.

### Sign-up example

```jsx noeditor
const SignUp = require('./sign-up.tsx').default;
const mockData = require('./mocks/sign-up.json');

<SignUp
     data={mockData.data}
     config={mockData.config}/>
```