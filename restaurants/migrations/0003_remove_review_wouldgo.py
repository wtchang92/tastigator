# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-05 05:14
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0002_review'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='wouldGo',
        ),
    ]
