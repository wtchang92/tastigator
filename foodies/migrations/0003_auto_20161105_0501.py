# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-05 05:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('foodies', '0002_auto_20161105_0412'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='test',
            name='owner',
        ),
        migrations.DeleteModel(
            name='Test',
        ),
    ]
