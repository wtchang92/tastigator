# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-09 02:54
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_thumb_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='thumb',
            old_name='User',
            new_name='Foodie',
        ),
    ]
