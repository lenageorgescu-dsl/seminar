This code was written for the software engineering seminar during the spring semester of 2023.
## Generating data
This application was developed to work on Ubuntu 22.04.
1. Adjust the paths in docker-compose.yml
2. Create a folder called "search-engine-volumes" on root level
3. Enter the app-folder and run the following commands:  
` 
(1) npm run docker:reboot  
`  
` 
(2) npm run start
`  
When bootstrappig the application, a health check is performed. If it fails, one should wait a few seconds and rerun (2).
3. An experiment can be run by opening localhost:3000/experiment/:experiment-number in the browser. This will generate a result file in the charts/src/assets folder. 
4. In between experiments, (1) needs to be run in order to empty the volumes
5. Once you've run multiple experiments, the results can be aggregated using the /experiment/compile/:from/:to endpoint, where from and to are the experiment-numbers of the first and last experiment to be included in the aggregation. 

## Visualizing data
Once you've generated a result file, the results can be visualized as follows:
1. Adjust the filepath in overview.component.ts to your result file
2. Enter the charts folder and run:   
`
ng serve
`


