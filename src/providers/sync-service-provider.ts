import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { DatabaseSqlServiceProvider, ExpenseApi, CategoryApi, ToastProvider } from '../shared/shared-providers';
import { SqliteCallbackModel, ExpenseModel, CategoryModel } from '../shared/shared-models';
import { LoadingController } from 'ionic-angular';


@Injectable()
export class SyncServiceProvider {
    private loader: any;

    private syncYear: number = 1900;
    private syncMonth: string = "";

    constructor(private loading: LoadingController, private toast: ToastProvider, private databaseSqlServiceProvider: DatabaseSqlServiceProvider, private expenseApi: ExpenseApi, private categoryApi: CategoryApi) {
        this.syncYear = parseInt(localStorage.getItem('budgetYear')),
            this.syncMonth = localStorage.getItem('budgetMonth')
    }

   

    sync() {
        this.syncCategories();
        //this.databaseSqlServiceProvider.expenseDbProvider.getAllNonSyncedRecords(2017, 'May', e => this.getAllNonSyncedRecordsCallback(e));

    }

    // CATEGORIES
    private syncCategories() {
        this.databaseSqlServiceProvider.categoryDbProvider.getAllNonSyncedRecords(e => this.getNonSyncedCategoryCallback(e))

    }

    private getNonSyncedCategoryCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (!sqliteCallbackModel.success) {
            this.toast.showToast("Error getting categories to sync");
            return;
        }

        this.loader = this.loading.create({
            content: 'Syncing categories, please wait...',
        });
        this.loader.present().then(() => {
            if (sqliteCallbackModel.data.length > 0) {
                this.addCategoriesToApi(sqliteCallbackModel.data);

            } else {
                this.getAllCategoriesFromApi();
            }

        });

    }

    private addCategoriesToApi(data) {
        //alert(JSON.stringify(data));
        this.categoryApi.addCategories(JSON.stringify(data))
            .subscribe(
            res => {
                this.toast.showToast('Categories Uploaded Successfully');
                this.getAllCategoriesFromApi();
            },
            err => {
                this.loader.dismiss();
                alert('Error uploading categories');
                console.log(err);
                return;
            }
            );
    }

    private getAllCategoriesFromApi() {
        this.categoryApi.getCategories()
            .subscribe(
            res => {
                if (res.length === 0) {
                    this.toast.showToast("No Categories from server");
                    this.syncExpenses();
                    return;
                }
                this.databaseSqlServiceProvider.categoryDbProvider.syncTable(res, e => this.syncCategoriesCallback(e));
            },
            err => {
                this.loader.dismiss();
                alert('Error getting all categories from API');
                console.log(err);
                return;
            }
            );
    }

    private syncCategoriesCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (!sqliteCallbackModel.success) {
            this.loader.dismiss();
            this.toast.showToast("Error syncing categories");
            return;
        }
        this.toast.showToast("Successfully synced categories");
        this.syncExpenses();
    }

    // EXPENSES
    private syncExpenses() {
        this.loader.setContent("Syncing expenses, please wait...")
        this.databaseSqlServiceProvider.expenseDbProvider.getAllNonSyncedRecords(this.syncYear, this.syncMonth, e => this.getNonSyncedExpensesCallback(e))

    }

    private getNonSyncedExpensesCallback(sqliteCallbackModel: SqliteCallbackModel) {
        if (!sqliteCallbackModel.success) {
            this.loader.dismiss();
            this.toast.showToast("Error getting expenses to sync");
            return;
        }


        if (sqliteCallbackModel.data.length > 0) {
            this.addExpensesToApi(sqliteCallbackModel.data);

        } else {
            this.getAllExpensesFromApi();
        }



    }

    private addExpensesToApi(data) {
        this.expenseApi.addExpenses(JSON.stringify(data))
            .subscribe(
            res => {
                this.toast.showToast('Expenses Uploaded Successfully');
                this.getAllExpensesFromApi();
            },
            err => {
                this.loader.dismiss();
                alert('Error uploading expenses');
                console.log(err);
                return;
            }
            );
    }

    private getAllExpensesFromApi() {
        this.expenseApi.getExpenses(this.syncYear, this.syncMonth)
            .subscribe(
            res => {

                if (res.length === 0) {
                    this.loader.dismiss();
                    this.toast.showToast("No Expenses from server");
                    return;
                }
                this.databaseSqlServiceProvider.expenseDbProvider.syncTable(this.syncYear, this.syncMonth, res, e => this.syncExpensesCallback(e));
            },
            err => {
                this.loader.dismiss();
                alert('Error getting all expenses from API');
                console.log(err);
                return;
            }
            );
    }

    private syncExpensesCallback(sqliteCallbackModel: SqliteCallbackModel) {
        this.loader.dismiss();
        if (!sqliteCallbackModel.success) {
            this.toast.showToast("Error syncing expenses");
            return;
        }
        this.toast.showToast("Successfully synced Expenses");
    }

    // private getAllNonSyncedRecordsCallback(sqliteCallbackModel: SqliteCallbackModel) {
    //     alert(JSON.stringify(sqliteCallbackModel.data))
    //     if (!sqliteCallbackModel.success) {
    //         this.toast.showToast("Error getting data to sync");
    //         return;
    //     }
    //     // let data = JSON.parse(sqliteCallbackModel.data);
    //     // alert(data);
    //     this.loader = this.loading.create({
    //         content: 'busy please wait...',
    //     });
    //     this.loader.present().then(() => {
    //         this.expenseApi.addExpenses(JSON.stringify(sqliteCallbackModel.data))
    //             .subscribe(
    //             res => {
    //                 this.loader.dismiss();
    //                 this.toast.showToast('Expenses Uploaded Successfully');
    //             },
    //             err => {
    //                 this.loader.dismiss();
    //                 alert('Error uploading expenses');
    //                 console.log(err);
    //                 return;
    //             }
    //             );
    //     });
    // }

}
