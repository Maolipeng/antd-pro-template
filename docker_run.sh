HOST_ADDRESS=$(ip -4 address | grep inet | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1)
echo "$HOST_ADDRESS"

if test $1 = "docker"
then
docker run -d \
    --name rsc-fe \
    -e "PROXY_PASS=http://172.17.0.3:5000" \
    -p 8000:80 \
    reg.real-ai.cn/rsc/rsc-fe-test:latest
elif test $1 = "local"
then
    npm start
fi