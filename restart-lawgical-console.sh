PID=$(sudo netstat -npl | awk '/:19000/' | awk -F "[ /]+" '{print $7; exit}')
sudo kill $PID
sudo nohup bash -c 'yarn start' &
