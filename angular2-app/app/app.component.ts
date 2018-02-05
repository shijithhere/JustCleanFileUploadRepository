import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import {Observable} from 'rxjs/Rx';
import { Injectable }     from '@angular/core';
import { HttpModule } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Customer }  from './model/Customer';

@Component({
    selector: 'my-app',
    template: `<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li><a>File Upload</a></li>
                </ul>
            </div>
        </div>
    </div>
</nav>
<div class="container">
    <ul class="nav nav-tabs">
        <li class="active"><a data-toggle="tab" href="#first">JustClean File Upload</a></li>
        <li><a data-toggle="tab" href="#second">Customer Information</a></li>

    </ul>
    <div class="tab-content">
    <div id="first" class="tab-pane fade in active" style="margin-top:50px">
            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <form>

                            <div class="form-group">

                                <input type="file" style="margin-top:50px" class="form-control" name="multiple" ng2FileSelect [uploader]="uploader" multiple />
                            </div>

                        </form>
                    </div>
                    <div class="col-md-8">


                        <table>
                            <tr>
                                <td>
                                    <input type="text" id="myNameInput" (keyup)="onKey('name')" style="border-radius: 1rem" placeholder="Search for names..">
                                </td>
                                <td>
                                    <input type="text" style="margin-left:30px;width:110px;border-radius: 1rem" id="myDateInput" (keyup)="onKey('date')" placeholder="Search for Date..">
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <input type="text" style="margin-left:330px;width:120px;border-radius: 1rem" id="myStatusInput" (keyup)="onKey('status')" placeholder="Search for Status..">
                                </td>
                            <tr>
                        </table>
                        <table class="table" id="myTable">
                            <thead>
                                <tr>
                                    <th width="30%">Name</th>
                                    <th width="20%">Date</th>
                                    <th width="20%">Size</th>
                                    <th width="20%">Progress</th>
                                    <th width="10%">Status</th>

                                </tr>
                            </thead>
                            <tbody>

                                <tr *ngFor="let item of uploader.queue.reverse()">
                                    <td><strong>{{ item.file.name }}</strong></td>
                                    <td>{{item.file.rawFile.lastModifiedDate | date:'dd-MM-yyyy' }}</td>

                                    <td nowrap>{{ item.file.size/1024/1024 | number:'.2' }} MB</td>
                                    <td>
                                        <div class="progress" style="margin-bottom: 0;">
                                            <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <span *ngIf="item.isSuccess">Completed</span>
                                        <span *ngIf="item.isCancel">Cancelled</span>
                                        <span *ngIf="item.isError">Error</span>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <div>
                                Queue progress:
                                <div class="progress" style="">
                                    <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': uploader.progress + '%' }"></div>
                                </div>
                            </div>
                            <button type="button" class="btn btn-success btn-s"
                                    (click)="uploader.uploadAll()" [disabled]="!uploader.getNotUploadedItems().length">
                                <span class="glyphicon glyphicon-upload"></span> Upload
                            </button>
                            <button type="button" class="btn btn-warning btn-s"
                                    (click)="uploader.cancelAll()" [disabled]="!uploader.isUploading">
                                <span class="glyphicon glyphicon-ban-circle"></span> Cancel
                            </button>
                            <button type="button" class="btn btn-danger btn-s"
                                    (click)="uploader.clearQueue()" [disabled]="!uploader.queue.length">
                                <span class="glyphicon glyphicon-trash"></span> Remove
                            </button>
                        </div>
                    </div>
                </div>
                </div>

            </div>
            <div id="second" class="tab-pane fade">
                <div class="container">
                    <h2>Complete list of details... </h2>
                   
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Serial No.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No:</th>
                                <th>Title</th>
                            </tr>
                        </thead>
                       <tbody>
                       <tr *ngFor="let item of Customerdata">
                       <td>{{item.SerialNo}}</td>
                       <td>{{item.Name}}</td>
                       <td>{{item.email}}</td>
                       <td>{{item.PhoneNumber}}</td>
                       <td>{{item.Title}}</td>
                       </tr>
                       </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
`
})

@Injectable()
export class AppComponent {
    public uploader:FileUploader = new FileUploader({url:'http://localhost:3000/upload',allowedMimeType:'application/vnd.ms-excel'] });
   // CustomerList: Observable<Customer[]>;
     Customerdata:any;

    constructor (private http: Http) {
     //this.CustomerList=this.getCustomers();
    
    }

    ngAfterViewInit() {
        this.uploader.onAfterAddingFile = (item => {
           item.withCredentials = false;
        });
        this.getCustomers();
     }

    // this.http.get(`http://swapi.co/api/people/1`).map((response:Response) => {
    //     console.log(response.json());
    //     response.json();
    // }).subscribe();

    getCustomers(): any {
    //         return data;
    this.http.get('http://localhost:3000/Customers')
    .subscribe(
        info=> {
           this.Customerdata=JSON.parse(info._body);
            //this.subject.next(data);
        },
        err => {
            //AlertService needs to be used here
        },
        () => {

        });
    }
    
    private extractData(res: Response) {
        let body = res.json();
        var d= Array.of(body);
    } 

    private handleErrorObservable (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    } 

    onKey(data: any) { 
        // Declare variables 
        var input, filter, table, tr, td, i,index;
         switch(data)
         {
             case 'name':
             input = document.getElementById("myNameInput");
             index=0;
             break;


             case 'date':
             input = document.getElementById("myDateInput");
             index=1;
             break;
             

             case 'status':
             input = document.getElementById("myStatusInput");
             index=4
             break;
             

         }
        
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
      
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[index];
          if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          } 
        }
      }
    
} 