This code was written for the software engineering seminar during the spring semester of 2023.
## Generating data
This application was developed to work on Ubuntu 22.04.
1. Adjust the paths in docker-compose.yml
2. Create a folder called "search-engine-volumes" on root level
3. Create an app/assets/data folder
4. Download the following datasets into the folder:
- https://www.kaggle.com/datasets/clementdelteil/500-000-tweets-on-elon-musk-nov-dec-2022
- https://www.kaggle.com/datasets/crawlfeeds/medium-articles-dataset
5. Rename the keys "id" and "_id" to "primary_id"
6. Enter the app-folder and run the following commands:  
` 
(1) npm run docker:reboot  
`  
` 
(2) npm run start
`  
When bootstrappig the application, a health check is performed. If it fails, one should wait a few seconds and rerun (2).
7. An experiment can be run by opening localhost:3000/experiment/:experiment-number in the browser. This will generate a result file in the charts/src/assets folder. 
8. In between experiments, (1) needs to be run in order to empty the volumes
9. Once you've run multiple experiments, the results can be aggregated using the /experiment/compile/:from/:to endpoint, where from and to are the experiment-numbers of the first and last experiment to be included in the aggregation. 
10. In order to display the aggregated results correctly in the line charts, open localhost:3000/experiment/axis/{path of the aggregated file}

## Visualizing data
Once you've generated a result file, the results can be visualized as follows:
1. Adjust the filepath in overview.component.ts to your result file
2. Enter the charts folder and run:   
`
ng serve
`


