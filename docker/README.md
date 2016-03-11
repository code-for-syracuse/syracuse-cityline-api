## Running SYRCityLine API in a Docker Container

You can find a Dockerfile in the ```docker``` directory. Fisrt, build the image:

```
~$ docker build -t {username}/syracuse-cityline-api -f docker/Dockerfile .
```

Run it:

```
~$ docker run -p 49160:2000 -d {username}/syracuse-cityline-api
```

You can can now access the container at ```http://{docker-ip}:49160```
