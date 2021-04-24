#include <bits/stdc++.h>
using namespace std;
string name[20],phn[20],address[20],arr4[20],arr5[20],mess_name[20],manager_name[20],manager_email[20],passwrod[20],bdate[20],mdate[20],item[20],m_name[20];
int t_mess=0,t_member[20],amount[20],t_bazar=0,meal[20];

void create(){
        
        for(int i=t_mess;i<t_mess+1;i++){
		cout<<"\n                         Enter Mess Name: ";
		cin>>mess_name[i];
		cout<<"\n                         Enter Total Member : ";
		cin>>t_member[i];
		cout<<"\n                         Enter Manager Name : ";
        cin>>manager_name[i];
		cout<<"\n                         Enter Manager Email : ";
        cin>>manager_email[i];
		cout<<"\n                         Enter Password : ";
        cin>>passwrod[i];
		}
		t_mess++;
}

void show_member(int n){
	cout<<"\n\n                         "<<mess_name[n]<<" has total "<<t_member[n]<<" member";
	cout<<"\n===========================Member Table====================";
	cout<<"\n----------------------------------------------------------";
	cout<<"\nname                phn                         address";
	cout<<"\n----------------------------------------------------------"<<endl;
	for(int i=0;i<t_member[n];i++){
		cout<<name[i]<<"             "<<phn[i]<<"                 "<<address[i]<<endl;
	}

}


void add_member(int n){
	cout<<"\n                         "<<mess_name[n]<<" you can enter "<<t_member[n]<<" member data";
    for(int i=0;i<t_member[n];i++){
        cout<<"\n                         Enter the Data of member: "<<i+1<<endl<<endl;
		cout<<"                         Enter name:";
		cin>>name[i];
		cout<<"                         Enter Mobile num: ";
		cin>>phn[i];
		cout<<"                         Enter address: ";
		cin>>address[i];
    }
}
void remove_member(int n){
	string m_name;
	cout<<"                         Enter member name:";
	cin>>m_name;
	for(int i=0;i<t_member[n];i++){
		if(name[i]==m_name){
			for(int j=i;j<t_member[n];j++){
				name[j]=name[j+1];
				phn[j]=phn[j+1];
				address[j]=address[j+1];
			}
			t_member[n]--;
			cout<<"                         Your required record is deleted"<<endl;
		}
	}

}
void add_bazar(){
     for(int i=t_bazar;i<t_bazar+1;i++){
		 cout<<"\n                         Enter bazar date:";
		 cin>>bdate[i];
		 cout<<"\n                         Enter bazar amount:";
		 cin>>amount[i];
		 cout<<"\n                         Enter bazar item:";
		 cin>>item[i];
	 }
	 t_bazar++;
}
void show_bazar(){
	cout<<"\n\n                         All"<<t_bazar<<"bazar list"<<endl;
	cout<<"\n===========================Bazar Table====================";
	cout<<"\n----------------------------------------------------------";
	cout<<"\n date                items                         amount";
	cout<<"\n----------------------------------------------------------"<<endl;
	for(int i=0;i<t_bazar;i++){
		cout<<bdate[i]<<"                "<<item[i]<<"                "<<amount[i]<<endl;
	}
}
void add_meal(int n){
	 cout<<"total " <<t_member[n]<<" member of "<< mess_name[n]<<" mess"<<endl;
	 int eat;
	 cout<<"How many member eat today:";
	 cin>>eat;
	 if(eat>t_member[n]){
		 cout<<"Invalid member number";
	 }else{
	for(int i=0;i<eat;i++){
			cout<<"\n                         Enter date:";
			cin>>mdate[i];
			cout<<"\n                         Enter member name:";
			cin>>m_name[i];
			cout<<"\n                         Enter meal:";
			cin>>meal[i];
		}
		t_bazar++;
	 }
	
}
void show_meal(int n){
	cout<<"\n\n                         All"<<t_member[n]<<"meal list"<<endl;
	cout<<"\n===========================meal Table====================";
	cout<<"\n----------------------------------------------------------";
	cout<<"\n date                items                         amount";
	cout<<"\n----------------------------------------------------------"<<endl;
	for(int i=0;i<t_member[n];i++){
		cout<<mdate[i]<<"                "<<m_name[i]<<"                "<<meal[i]<<endl;
	}
}

void login(){
	int m_n;
	string email,pass;
	if(t_mess!=0){
		//mess info	
		cout<<"\n                         Enter manager email: ";
		cin>>email;
      for(int i=0;i<t_mess;i++){
		  if(email==manager_email[i]){
		      cout<<"\n                         Enter manager password: ";
		      cin>>pass;
			  if(pass==passwrod[i]){
				  while (true)
				  {
					int value;
					m_n=i;
					cout<<"\n                         welcome to  "<<mess_name[i]<<" mess";
					cout<<"\n                         Enter 0 for calculation table:";
					cout<<"\n                         Enter 1 for add member:";
					cout<<"\n                         Enter 2 for remove member:";
					cout<<"\n                         Enter 3 for show member:";
					cout<<"\n                         Enter 4 for add bazar:";
					cout<<"\n                         Enter 5 for show bazar:";
					cout<<"\n                         Enter 6 for add meal:";
					cout<<"\n                         Enter 7 for show meal :";
                    cout<<"\n\n                         Enter value: ";
				    
					cin>>value;

					switch (value)
					{
					case 1:
						add_member(m_n);
						break;
					case 2:
						remove_member(m_n);
						break;
					case 3:
						show_member(m_n);
						break;
					case 4:
						add_bazar();
						break;
					case 5:
						show_bazar();
						break;
					case 6:
						add_meal(m_n);
						break;
					case 7:
						show_meal(m_n);
						break;
					default:
						break;
					}
				  } 
				
			  }else{
				  cout<<"\n password is invalid"<<endl;
			  }
		  }else{
				  cout<<"\n Email is invalid"<<endl;
		  }
	  }
	}else{
		cout<<"\n                         Database is empty";
	}
}

int  main()
{
	int value;
	while(true)
	{
	cout<<"\n\n ======================= Main Menu ===================="<<endl;
	cout<<"\n                         Press 1 to create a new mess "<<endl;
	cout<<"\n                         Press 2 to login a mess "<<endl;
	cout<<"\n                         Enter value: ";
	cin>>value;
	switch(value)
	{
	case 1:
        create();
        break;
	case 2:
        login();
        break;
		default:
			cout<<"Invalid input: "<<endl;
			break;
	}
}
}