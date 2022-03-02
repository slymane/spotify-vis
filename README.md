# spotify-vis

Visual Analytics Winter 2022 Group Project

# Setting up the web server
```sh
npm install
npm run build
npm run dev
```

## Data

It's bad practice to store large file on GitHub. Due to this, the data must first be downloaded from Google Drive and placed in the appropriate place in the repository. This can be done in one of two ways:

1. Manually download [tracks.zip]() and [artists.zip]() from google drive and extract to `public/static/csv/`
2. Run the following [script](download_csv.sh) from the project root

```sh
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

```
