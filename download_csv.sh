CSV_PREFIX=./public/static/csv
FILES=(tracks artists)

which gdown > /dev/null
if [ "$?" -ne 0 ]; then
    echo "Install gdown before continuing - pip install gdown"
fi

gdown https://drive.google.com/uc?id=1PvQbbD8dbTzm67oRp1L158TxOhNY6OBn \
        -O $CSV_PREFIX/tracks.zip
gdown https://drive.google.com/uc?id=1vhp0qat_Lh9lRWkcz3A9pRa-2F5UOdjV \
        -O $CSV_PREFIX/artists.zip

for F in ${FILES[@]}; do
    unzip $CSV_PREFIX/$F.zip
    rm -f $CSV_PREFIX/$F.zip
done
