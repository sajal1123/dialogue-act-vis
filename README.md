## Project/Team

Dialogue Act Prediction Visualization

We propose a visualization tool that will show relationships of dialogue act label and candidate predictive factors like emotion and turn-taking, as well as experiment with visuals that will display more structural effects of the neural network classifier.

Team:<br>Sajal Chandra<br>
Paul Dougherty<br>
Karthik Vedaraju<br>

## Instructions to run
> npm install <br>
> To start the prod server: npm start <br>
> To start the dev server: npm run dev

Credits: This support code has been written by Andrew Wentzel, a member of the Electronic Visualization Laboratory at UIC.

## Docs

Directory Structure:
```
.
├── build                   # Contains Dockerfiles
├── src                     # Source files
│   ├── components          # Container react components
│   │   ├── shared          # Contains shared components, that are used throughout the project
│   │   ├── visulizations   # Containes all the plot components that go inside the panels
│   ├── tabs                # Contains all the tab jsx files that render the PanelContainer components.
└── README.md
```

To create a panel:

```jsx
<Panel title={"Panel Title"} visulization={<VisualizationComponent />} />
```
Now you can go ahead and add the panel to a panel container.

To test the this out, you can use the two example visualizations given in visulizations directory
```jsx
<Panel title={"Panel 1"} bgColor={"#CDA434"} visulization={<TestVis1/>}/>
<Panel title={"Panel 2"} bgColor={"#4C514A"} visulization={<TestVis2/>}/>
```



To add a panel container:
```jsx
<PanelContainer panels={[ <Panel />, <Panel />]}>
```
The above code adds a row with panels
