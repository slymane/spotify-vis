CSV_PREFIX=./public/static/csv
FILES=(tracks artists)

which gdown > /dev/null
if [ "$?" -ne 0 ]; then
    echo "Install gdown before continuing - pip install gdown"
    exit 1
fi

gdown https://drive.google.com/uc?id=1PvQbbD8dbTzm67oRp1L158TxOhNY6OBn
gdown https://drive.google.com/uc?id=1vhp0qat_Lh9lRWkcz3A9pRa-2F5UOdjV

for F in ${FILES[@]}; do
    unzip $F.zip
    rm -f $F.zip
    mv $F.csv $CSV_PREFIX/$F.csv
done
