# NavigationMenu Module

Main menu is the navigation bar module where you can view multiple Menu Items .

### Main menu example

```jsx noeditor
const NavigationMenu = require('./navigation-menu.tsx').default;
const mockData = require('./mocks/navigation-menu.json');
  
<NavigationMenu data={mockData.data} config={mockData.config} resources={mockData.resources}/>;
```
### Local testing

1. `yarn start`
1. http://localhost:3000/modules/?type=navigation-menu:navigation-menu