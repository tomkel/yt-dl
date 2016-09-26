if test -e dist/bundle.*js
    scp dist/* *.png tkel.ly:/var/www/yt-dl
else
    echo Build first, then deploy.
end
