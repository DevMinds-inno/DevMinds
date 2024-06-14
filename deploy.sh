# 1. backup
cd
rm -rf ./bak/*
mv -f ./prod/* ./bak/
echo "== 1. DONE :: BackUp to bak ==="

# 2. unzip
cd 
unzip -q archive.zip -d ./prod/

# database.db 복구
cp -f ./bak/database.db ./prod/database.db
echo "== 2. DONE :: Unzip to Prod ==="

# 3. 가상환경 셋팅 
echo "== 3. Start Setting virtualenv =="

cd
cd ./prod
python -m venv prod_env
echo "== 3. End Setting virtualenv =="

echo "== 4. Start install requirements =="
source prod_env/bin/activate
pip install -r requirements.txt
deactivate
echo "== 4. End install requirements =="


echo "*** All Done! Please Restart Server ***"