# Known bugs
- Sidebar & Tabs Navigation: tab navigation does not update current tab in the navbar, so using them interchangeably bugs the navigation
- Select: when you type an option that does not exist and press enter, an error occurs
- Backend regex is not working -> this is because table=true is being set on the models
- VirtualizedTable refresh button not working when the database has no data in the corresponding table
- VirtualizedTable show selected only checkbox is still available when there are is no selected data
- Select: SelectBox follows scrolling
- TaskAccordionItem: when a new Task is created, RoutesTab does not update its tasks

## Future changes
- tsys_units: 'type' column will be changed to 'category'
- height parameters in MultiStepForm