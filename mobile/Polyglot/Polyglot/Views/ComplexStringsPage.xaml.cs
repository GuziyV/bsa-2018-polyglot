﻿using Polyglot.ViewModels;
using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Polyglot.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ComplexStringsPage : ContentPage
    {

        public ComplexStringsPage(ViewModels.ComplexStringsViewModel complexStringsViewModel, int projectId)
        {
            BindingContext = complexStringsViewModel;

            InitializeComponent();
            complexStringsViewModel.Initialize(projectId);
        }

        async void Handle_ItemTapped(object sender, ItemTappedEventArgs e)
        {
            if (e.Item == null)
                return;

            ((ListView)sender).SelectedItem = null;

            var complexString = e.Item as ComplexStringViewModel;

            var newPage = new TranslationsPage(new ViewModels.TranslationsViewModel(), complexString.Id, complexString.ProjectId);
            await Navigation.PushAsync(newPage);

        }
    }
}
