# Generated by Django 5.0.7 on 2024-08-05 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organizations',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
