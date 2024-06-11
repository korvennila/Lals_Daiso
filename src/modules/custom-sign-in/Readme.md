### Sign-in Module

Sign-in showcases key content as well as the primary action on the page.

### Sign-in example

```jsx noeditor
const SignIn = require('./sign-in.tsx').default;
const mockData = require('./mocks/sign-in.json');

<SignIn
     data={mockData.data}
     config={mockData.config}/>
```