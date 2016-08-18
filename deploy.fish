if test -e dist/bundle.js
    scp dist/bundle.js index.html *.png tkel.ly:/var/www/yt-dl
else
    echo Build first, then deploy.
end
