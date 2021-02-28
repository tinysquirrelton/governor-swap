npm install
npm update governor-common
npm install
BUILD_PATH=temp_build npm run build
rm -rf build
mv temp_build build
